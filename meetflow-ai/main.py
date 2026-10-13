from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
import aiofiles
import json
import uuid
import asyncio
import time

from google import genai
from google.genai import types

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
Bu toplantı ses/video kaydını dinle.
SADECE GEÇERLİ BİR JSON ÇIKTISI VER. BAŞKA HİÇBİR YORUM YAZMA.
Format:
{
  "tam_metin": "konuşma metni buraya",
  "gorevler": [
    {"title": "Acil | Görev 1"},
    {"title": "Orta | Görev 2"}
  ]
}
"""

DENENECEK_MODELLER = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]

@app.get("/")
def read_root():
    return {"mesaj": "MeetFlow AI Mikroservisi calisiyor (Yeni GenAI Sürümü)!"}

@app.post("/analyze-audio")
async def analyze_audio(file: UploadFile = File(...)):
    if not client:
        return {
            "mesaj": "İşlem tamamlandı.",
            "tam_metin": "SİSTEM HATASI: GEMINI_API_KEY bulunamadı.",
            "gorevler": json.dumps([{"title": "Hata | API Key Eksik"}], ensure_ascii=False)
        }

    ext = os.path.splitext(file.filename)[1]
    temp_file_path = f"temp_{uuid.uuid4().hex}{ext}"

    async with aiofiles.open(temp_file_path, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)

    uploaded_file = None
    
    try:
        uploaded_file = await asyncio.to_thread(client.files.upload, file=temp_file_path)
        
        timeout_time = time.time() + 120
        while uploaded_file.state is not None and uploaded_file.state.name == "PROCESSING":
            if time.time() > timeout_time:
                raise TimeoutError("Google dosyayı 120 saniyede işleyemedi.")
            await asyncio.sleep(2)
            uploaded_file = await asyncio.to_thread(client.files.get, name=uploaded_file.name)
            
        if uploaded_file.state is not None and uploaded_file.state.name == "FAILED":
            raise Exception("Google Gemini dosyayı işleyemedi.")

        response_text = None
        basarili_model = None
        son_hata = None

        for model_adi in DENENECEK_MODELLER:
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
                    son_hata = e
                    hata_str = str(e)
                    if "503" in hata_str and deneme < 2:
                        await asyncio.sleep(4)
                        continue
                    break
            
            if response_text:
                break

        if not response_text:
            raise son_hata or Exception("Tüm modeller denendi fakat yanıt alınamadı.")

        try:
            result_data = json.loads(response_text)
        except Exception:
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            result_data = json.loads(clean_text)

        transcript = result_data.get("tam_metin", "Metin bulunamadı.")
        gorevler = json.dumps(result_data.get("gorevler", []), ensure_ascii=False)

        return {
            "mesaj": "İşlem tamamlandı.",
            "model": basarili_model,
            "tam_metin": transcript,
            "gorevler": gorevler,
        }

    except Exception as e:
        hata_mesaji = str(e)
        print(f"Kritik Hata: {hata_mesaji}")
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