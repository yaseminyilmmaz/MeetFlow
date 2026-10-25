from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
import aiofiles
import json
import uuid
import asyncio
import time
import logging
import mimetypes

from google import genai
from google.genai import types

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("meetflow")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key) if gemini_api_key else None

PROMPT = """
Bu toplantı ses/video kaydını dinle ve özetle.
SADECE GEÇERLİ BİR JSON OBJESİ ÇIKTISI VER. KESİNLİKLE LİSTE ([]) DÖNME. BAŞKA HİÇBİR YORUM YAZMA.

Zorunlu JSON Formatı (Aşağıdaki anahtarlar kesinlikle olmalıdır):
{
  "tam_metin": "Konuşmada geçen detaylı metnin özeti veya dökümü.",
  "gorevler": [
    {"title": "Acil | Görev 1"},
    {"title": "Orta | Görev 2"}
  ]
}
"""

def _get_active_models():
    """Google API'den aktif ve çalışan modelleri dinamik olarak çeker."""
    yedek_modeller = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest"]
    if not client:
        return yedek_modeller
    try:
        bulunanlar = []
        for m in client.models.list():
            methods = getattr(m, "supported_generation_methods", []) or []
            if "generateContent" in methods or not methods:
                name = m.name.replace("models/", "") if hasattr(m, "name") else str(m)
                if "flash" in name or "pro" in name:
                    bulunanlar.append(name)
        if bulunanlar:
            log.info("Google API'den bulunan aktif modeller: %s", bulunanlar)
            return bulunanlar
    except Exception as e:
        log.warning("Dinamik model listesi alınamadı (%s), yedek liste kullanılacak.", e)
    return yedek_modeller

@app.get("/")
def read_root():
    modeller = _get_active_models()
    return {"mesaj": "MeetFlow AI Mikroservisi calisiyor!", "aktif_modeller": modeller}

@app.post("/analyze-audio")
async def analyze_audio(file: UploadFile = File(...)):
    if not client:
        return {
            "mesaj": "İşlem tamamlandı.",
            "tam_metin": "SİSTEM HATASI: GEMINI_API_KEY bulunamadı.",
            "gorevler": json.dumps([{"title": "Hata | API Key Eksik"}], ensure_ascii=False)
        }

    ext = os.path.splitext(file.filename)[1].lower()
    temp_file_path = f"temp_{uuid.uuid4().hex}{ext}"

    async with aiofiles.open(temp_file_path, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)

    uploaded_file = None
    
    try:
        mime_type, _ = mimetypes.guess_type(temp_file_path)
        if not mime_type:
            if ext in ['.m4a', '.mp4']:
                mime_type = 'audio/mp4'
            elif ext == '.mp3':
                mime_type = 'audio/mp3'
            elif ext == '.wav':
                mime_type = 'audio/wav'
            elif ext == '.aac':
                mime_type = 'audio/aac'
            else:
                mime_type = 'audio/mpeg'

        uploaded_file = await asyncio.to_thread(
            client.files.upload, 
            file=temp_file_path,
            config=types.UploadFileConfig(mime_type=mime_type)
        )
        
        timeout_time = time.time() + 120
        while uploaded_file.state is not None and uploaded_file.state.name == "PROCESSING":
            if time.time() > timeout_time:
                raise TimeoutError("Google dosyayı 120 saniyede işleyemedi.")
            await asyncio.sleep(2)
            uploaded_file = await asyncio.to_thread(client.files.get, name=uploaded_file.name)
            
        if uploaded_file.state is not None and uploaded_file.state.name == "FAILED":
            raise Exception("Google Gemini dosyayı işleyemedi.")

        modeller = await asyncio.to_thread(_get_active_models)

        response_text = None
        basarili_model = None
        denenen_hatalar = []

        for model_adi in modeller:
            for deneme in range(3):
                try:
                    response = await asyncio.to_thread(
                        client.models.generate_content,
                        model=model_adi,
                        contents=[uploaded_file, PROMPT],
                        config=types.GenerateContentConfig(response_mime_type="application/json")
                    )
                    response_text = response.text
                    basarili_model = model_adi
                    break
                except Exception as e:
                    denenen_hatalar.append(f"{model_adi}: {e}")
                    hata_str = str(e)
                    if "503" in hata_str and deneme < 2:
                        await asyncio.sleep(4)
                        continue
                    break
            if response_text:
                break

        if not response_text:
            raise Exception("Denenen modeller başarısız oldu: " + " | ".join(denenen_hatalar[-2:]))

        try:
            result_data = json.loads(response_text)
        except Exception:
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            result_data = json.loads(clean_text)

        if isinstance(result_data, dict):
            transcript = result_data.get("tam_metin", "Analiz metni bulunamadı.")
            raw_gorevler = result_data.get("gorevler", [])
        elif isinstance(result_data, list):
            transcript = "Yapay zeka metin özeti yerine sadece görev listesi döndürdü."
            raw_gorevler = result_data
        else:
            transcript = "Analiz çözümlenemedi."
            raw_gorevler = []

        gorevler = json.dumps(raw_gorevler, ensure_ascii=False)

        return {
            "mesaj": "İşlem tamamlandı.",
            "model": basarili_model,
            "tam_metin": transcript,
            "gorevler": gorevler,
        }

    except Exception as e:
        hata_mesaji = str(e)
        log.exception("Analiz hatasi: %s", hata_mesaji)
        return {
            "mesaj": "İşlem tamamlandı.",
            "tam_metin": f"SİSTEM HATASI: {hata_mesaji}",
            "gorevler": json.dumps([{"title": "Hata | İşlem Başarısız"}], ensure_ascii=False)
        }

    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        if uploaded_file is not None:
            try:
                await asyncio.to_thread(client.files.delete, name=uploaded_file.name)
            except Exception:
                pass