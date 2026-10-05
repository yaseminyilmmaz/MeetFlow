from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
import aiofiles
import json
import time
import uuid
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
client = genai.Client(api_key=gemini_api_key)

@app.get("/")
def read_root():
    return {"mesaj": "MeetFlow AI Mikroservisi calisiyor!"}

@app.post("/analyze-audio")
async def analyze_audio(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1]
    temp_file_path = f"temp_{uuid.uuid4().hex}{ext}"
    
    async with aiofiles.open(temp_file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
        
    try:
        audio_file = client.files.upload(file=temp_file_path)
        
        while audio_file.state.name == "PROCESSING":
            time.sleep(2)
            audio_file = client.files.get(name=audio_file.name)
            
        if audio_file.state.name == "FAILED":
            raise Exception("Google Gemini dosyayı işleyemedi.")
        
        prompt = """
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

        aktif_model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        
        config = types.GenerateContentConfig(
            response_mime_type="application/json",
        )

        response = client.models.generate_content(
            model=aktif_model, 
            contents=[audio_file, prompt],
            config=config
        )
        
        raw_text = response.text
        
        try:
            result_data = json.loads(raw_text)
            transcript = result_data.get("tam_metin", "Metin bulunamadı.")
            extracted_tasks = json.dumps(result_data.get("gorevler", []))
        except Exception:
            clean_text = raw_text.replace("```json", "").replace("```", "").strip()
            try:
                result_data = json.loads(clean_text)
                transcript = result_data.get("tam_metin", "Metin bulunamadı.")
                extracted_tasks = json.dumps(result_data.get("gorevler", []))
            except Exception:
                transcript = f"Metin başarıyla çıkarıldı ancak JSON ayrıştırılamadı:\n\n{raw_text}"
                extracted_tasks = json.dumps([{"title": "Sistem | Metin alındı, görevler ayrıştırılamadı."}])
            
    except Exception as e:
        transcript = f"SİSTEM HATASI: {str(e)}"
        extracted_tasks = json.dumps([{"title": "Hata | İşlem Başarısız"}])
        
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            
    return {
        "mesaj": "İşlem tamamlandı.",
        "tam_metin": transcript,
        "gorevler": extracted_tasks
    }