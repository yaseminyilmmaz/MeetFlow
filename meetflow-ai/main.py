from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
import aiofiles
import json
import time
import uuid
from google import genai

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
        available_models = [m.name for m in client.models.list()]
        
        target_model = None
        for model_name in available_models:
            if "gemini-1.5-flash" in model_name:
                target_model = model_name
                break
        
        if not target_model:
            for model_name in available_models:
                if "gemini" in model_name and ("flash" in model_name or "pro" in model_name):
                    target_model = model_name
                    break

        if not target_model:
            target_model = "gemini-1.5-flash"

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
        
        response = client.models.generate_content(
            model=target_model, 
            contents=[audio_file, prompt]
        )
        
        raw_text = response.text
        
        try:
            clean_text = raw_text.replace("```json", "").replace("```", "").strip()
            result_data = json.loads(clean_text)
            transcript = result_data.get("tam_metin", raw_text)
            extracted_tasks = json.dumps(result_data.get("gorevler", []))
        except Exception:
            transcript = f"Yapay zeka yanıt verdi ancak JSON bozuk:\n\n{raw_text}"
            extracted_tasks = json.dumps([{"title": "Orta | Görevler ayrıştırılamadı"}])
            
    except Exception as e:
        try:
            models = [m.name for m in client.models.list()]
            model_str = "\n".join(models)
        except Exception:
            model_str = "Model listesi alınamadı."
            
        transcript = f"SİSTEM HATASI: {str(e)}\n\n(HATA AYIKLAMA) API ANAHTARINIZIN DESTEKLEDİĞİ MODELLER:\n{model_str}"
        extracted_tasks = json.dumps([{"title": "Sistem | Hata oluştu"}])
        
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            
    return {
        "mesaj": "İşlem tamamlandı.",
        "tam_metin": transcript,
        "gorevler": extracted_tasks
    }