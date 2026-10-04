from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
import aiofiles
import json
import time
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
    return {"mesaj": "MeetFlow AI Mikroservisi başarıyla çalışıyor!"}

@app.post("/analyze-audio")
async def analyze_audio(file: UploadFile = File(...)):
    temp_file_path = f"temp_{file.filename}"
    
    async with aiofiles.open(temp_file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
        
    try:
        print(f"'{temp_file_path}' dosyası Gemini'ye yükleniyor...")
        audio_file = client.files.upload(file=temp_file_path)
        
        print("Gemini dosyanın işlenmesini bekliyor...")
        while audio_file.state.name == "PROCESSING":
            time.sleep(2)
            audio_file = client.files.get(name=audio_file.name)
        
        prompt = """
        Bu toplantı ses/video kaydını dinle. Bana aşağıdaki JSON formatında, eksiksiz bir yanıt dön. Başka hiçbir açıklama yazma:
        {
          "tam_metin": "Buraya toplantıda konuşulanların tamamını metin olarak yaz",
          "gorevler": [
            {"title": "Acil | Müşteri veritabanını güncelle"},
            {"title": "Orta | Yeni logo tasarımını onaya gönder"}
          ]
        }
        """
        
        response = client.models.generate_content(
            model='gemini-1.5-flash', 
            contents=[audio_file, prompt]
        )
        
        result_text = response.text.replace("```json", "").replace("```", "").strip()
        result_data = json.loads(result_text)
        
        transcript = result_data.get("tam_metin", "Metin çıkarılamadı.")
        extracted_tasks = json.dumps(result_data.get("gorevler", []))
        
        print("Gemini başarıyla çalıştı!")
        
    except Exception as e:
        print(f"Hata: {e}")
        transcript = "Ses analiz edilemedi."
        extracted_tasks = "[\n  {\"title\": \"Sistem Uyarısı | İşlem başarısız.\"}\n]"
        
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            
    return {
        "mesaj": f"'{file.filename}' başarıyla analize tabi tutuldu.",
        "tam_metin": transcript,
        "gorevler": extracted_tasks
    }