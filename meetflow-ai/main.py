from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import whisper
import os
import aiofiles
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

print("Yapay Zeka Modeli (Whisper) yükleniyor, lütfen bekleyin...")
model = whisper.load_model("base")
print("Model başarıyla yüklendi!")

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
        print(f"'{temp_file_path}' dosyası Whisper tarafından analiz ediliyor...")
        result = model.transcribe(temp_file_path)
        transcript = result["text"]
        
        print("Metin elde edildi. Şimdi Gemini ile görevler (task) çıkarılıyor...")
        
        prompt = f"""
        Aşağıdaki toplantı dökümünü analiz et. Sadece net bir şekilde yapılması gereken görevleri (task) çıkar.
        Görevleri Acil, Orta veya Düşük önceliklerine göre sınıflandır.
        Bana sadece şu JSON formatında bir çıktı ver, ekstra hiçbir açıklama yazma:
        [
          {{"title": "Acil | Müşteri veritabanını güncelle"}},
          {{"title": "Orta | Yeni logo tasarımını onaya gönder"}}
        ]
        
        Toplantı Metni: {transcript}
        """
        
        try:
            response = client.models.generate_content(
                model='gemini-3.8-flash', 
                contents=prompt,
            )
            extracted_tasks = response.text
            print("Gemini görevleri başarıyla çıkardı!")
            
        except Exception as e:
            print(f"DİKKAT: Gemini API yanıt vermedi. Hata: {e}")
            extracted_tasks = "[\n  {\"title\": \"Sistem Uyarısı | Google Yapay Zeka sunucuları şu an aşırı yoğun. Görev çıkarımı yapılamadı, ancak metin dökümü başarıyla alındı. Lütfen birkaç dakika sonra tekrar deneyin.\"}\n]"
        
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            
    return {
        "mesaj": f"Harika! '{file.filename}' başarıyla analize tabi tutuldu.",
        "tam_metin": transcript,
        "gorevler": extracted_tasks
    }