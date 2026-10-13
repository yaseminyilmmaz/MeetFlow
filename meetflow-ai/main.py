from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import aiofiles
import json
import uuid
import asyncio
import logging
import time
from google import genai
from google.genai import types

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("meetflow-ai")

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

_liste = os.getenv("GEMINI_MODELS") or os.getenv("GEMINI_MODEL") or "gemini-3.8-flash"
MODELLER = [m.strip() for m in _liste.split(",") if m.strip()]

# Gecici hatalar: bekleyip tekrar denemeye deger
GECICI = {429, 500, 503, 504}

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


def _hata_kodu(e):
    code = getattr(e, "code", None)
    if isinstance(code, int):
        return code
    metin = str(e)
    for c in (503, 429, 504, 500, 404):
        if str(c) in metin:
            return c
    return None


async def _dene(fn, *args, deneme=3, beklemeler=(2, 5)):
    """Blokaj yapan Google cagrisini ayri thread'de calistirir.
    Gecici hatada (503/429/500/504) artan beklemeyle tekrar dener."""
    for i in range(deneme):
        try:
            return await asyncio.to_thread(fn, *args)
        except Exception as e:
            kod = _hata_kodu(e)
            if kod in GECICI and i < deneme - 1:
                bekle = beklemeler[min(i, len(beklemeler) - 1)]
                log.warning("Gecici hata (%s), %s sn sonra tekrar denenecek", kod, bekle)
                await asyncio.sleep(bekle)
                continue
            raise


def _yukle(path):
    f = client.files.upload(file=path)
    bitis = time.time() + 120
    while f.state is not None and f.state.name == "PROCESSING":
        if time.time() > bitis:
            raise TimeoutError("Google dosyayi 120 saniyede isleyemedi.")
        time.sleep(2)
        f = client.files.get(name=f.name)
    if f.state is not None and f.state.name == "FAILED":
        raise RuntimeError("Google Gemini dosyayı işleyemedi.")
    return f


def _uret(model_adi, audio_file):
    return client.models.generate_content(
        model=model_adi,
        contents=[audio_file, PROMPT],
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )


async def _icerik_uret(audio_file):
    """Modelleri sirayla dener. Gecici hata ya da 404 olursa siradaki modele gecer."""
    son_hata = None
    for model_adi in MODELLER:
        try:
            response = await _dene(_uret, model_adi, audio_file)
            return response, model_adi
        except Exception as e:
            son_hata = e
            kod = _hata_kodu(e)
            if kod in GECICI or kod == 404:
                log.warning("%s basarisiz (%s), siradaki model deneniyor", model_adi, kod)
                continue
            raise
    raise son_hata


def _ayristir(raw_text):
    try:
        veri = json.loads(raw_text)
    except Exception:
        temiz = raw_text.replace("```json", "").replace("```", "").strip()
        veri = json.loads(temiz)
    return veri.get("tam_metin", "Metin bulunamadı."), veri.get("gorevler", [])


@app.get("/")
def read_root():
    return {"mesaj": "MeetFlow AI Mikroservisi calisiyor!", "modeller": MODELLER}


@app.post("/analyze-audio")
async def analyze_audio(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1]
    temp_file_path = f"temp_{uuid.uuid4().hex}{ext}"

    async with aiofiles.open(temp_file_path, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)

    audio_file = None
    try:
        audio_file = await _dene(_yukle, temp_file_path)
        response, kullanilan_model = await _icerik_uret(audio_file)

        try:
            transcript, gorevler = _ayristir(response.text)
        except Exception:
            log.exception("JSON ayristirilamadi")
            return JSONResponse(
                status_code=502,
                content={"hata": True, "mesaj": "Yapay zeka yanıtı okunamadı, lütfen tekrar deneyin."},
            )

        return {
            "mesaj": "İşlem tamamlandı.",
            "model": kullanilan_model,
            "tam_metin": transcript,
            "gorevler": json.dumps(gorevler, ensure_ascii=False),
        }

    except Exception as e:
        kod = _hata_kodu(e)
        log.exception("Analiz basarisiz (kod=%s)", kod)
        if kod in GECICI:
            mesaj = "Yapay zeka servisi şu an yoğun. Lütfen 1-2 dakika sonra tekrar deneyin."
        else:
            mesaj = f"Analiz başarısız oldu: {e}"
        return JSONResponse(status_code=503, content={"hata": True, "mesaj": mesaj})

    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        if audio_file is not None:
            try:
                await asyncio.to_thread(client.files.delete, name=audio_file.name)
            except Exception:
                pass