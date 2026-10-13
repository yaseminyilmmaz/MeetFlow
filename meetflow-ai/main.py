from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
import aiofiles
import json
import uuid
import asyncio
import google.generativeai as genai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_api_key = os.getenv("GEMINI_API_KEY")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)

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

@app.get("/")
def read_root():
    return {"mesaj": "MeetFlow AI Mikroservisi calisiyor (Stabil Sürüm)!"}

@app.post("/analyze-audio")
async def analyze_audio(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1]
    temp_file_path = f"temp_{uuid.uuid4().hex}{ext}"

    async with aiofiles.open(temp_file_path, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)

    uploaded_file = None
    
    try:
        uploaded_file = await asyncio.to_thread(genai.upload_file, temp_file_path)
        
        while uploaded_file.state.name == "PROCESSING":
            await asyncio.sleep(2)
            uploaded_file = await asyncio.to_thread(genai.get_file, uploaded_file.name)
            
        if uploaded_file.state.name == "FAILED":
            raise Exception("Google Gemini dosyayı işleyemedi.")

        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        
        max_deneme = 3
        response_text = ""
        
        for deneme in range(max_deneme):
            try:
                response = await asyncio.to_thread(
                    model.generate_content,
                    [uploaded_file, PROMPT]
                )
                response_text = response.text
                break
            except Exception as e:
                hata_str = str(e)
                if "503" in hata_str and deneme < max_deneme - 1:
                    print(f"Yoğunluk (503) tespit edildi. 5 saniye bekleniyor... (Deneme {deneme+1})")
                    await asyncio.sleep(5) # 5 saniye bekle ve tekrar dene
                    continue
                else:
                    raise e

        try:
            result_data = json.loads(response_text)
        except Exception:
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            result_data = json.loads(clean_text)

        transcript = result_data.get("tam_metin", "Metin bulunamadı.")
        gorevler = json.dumps(result_data.get("gorevler", []), ensure_ascii=False)

        return {
            "mesaj": "İşlem tamamlandı.",
            "tam_metin": transcript,
            "gorevler": gorevler,
        }

    except Exception as e:
        hata_mesaji = str(e)
        print(f"Kritik Hata: {hata_mesaji}")
        return {
            "mesaj": "İşlem tamamlandı.",
            "tam_metin": f"SİSTEM HATASI: Google şu an yanıt veremiyor ({hata_mesaji[:50]})...",
            "gorevler": json.dumps([{"title": "Hata | İşlem Başarısız"}], ensure_ascii=False)
        }

    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        if uploaded_file is not None:
            try:
                await asyncio.to_thread(genai.delete_file, uploaded_file.name)
            except:
                pass