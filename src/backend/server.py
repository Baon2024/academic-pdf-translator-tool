##This is the FASTAPI version of the server in Python
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import shutil
import os
import requests
from typing import List
from dotenv import load_dotenv

##from backend_functions import translate_text, chunk_text  # Replicates your Node.js helpers

app = FastAPI()

load_dotenv() 

api_key = os.getenv("HF_TOKEN")

#print("Loaded HF_TOKEN:", api_key)  # Just for debugging

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def translate_text(text, model_url, api_key):
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    response = requests.post(
        model_url,
        headers=headers,
        json={"inputs": text}
    )

    #print("🛰️ HuggingFace Status:", response.status_code)
    #print("📩 HuggingFace Response:", response.text)


    response.raise_for_status()
    translated = response.json()
    return translated[0]["translation_text"] if isinstance(translated, list) else translated

def chunk_text(text, max_length=500):
    words = text.split()
    chunks = []
    chunk = []

    for word in words:
        if len(" ".join(chunk + [word])) > max_length:
            chunks.append(" ".join(chunk))
            chunk = [word]
        else:
            chunk.append(word)
    if chunk:
        chunks.append(" ".join(chunk))
    return chunks

@app.post("/translate-pdf-python")
async def translate_pdf(pdf: UploadFile = File(...), language: str = Form(...)):
    if not pdf.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    print("API endpoint hit!!")

    file_path = os.path.join(UPLOAD_DIR, pdf.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(pdf.file, buffer)

    try:
        # Convert language JSON string to dict
        import json
        print("📥 Raw language input:", language)
        language_data = json.loads(language)
        chosen_language = language_data['value']
        print("✅ Chosen language:", chosen_language)

        # Extract text from PDF
        with pdfplumber.open(file_path) as pdf_file:
            text = "\n".join(page.extract_text() or "" for page in pdf_file.pages)
        cleaned_text = " ".join(text.split())
        print("📄 Extracted and cleaned text length:", len(cleaned_text))

        # Choose model
        
        #API_KEY = os.getenv("API_KEY")
        #print("API_KEY is:" + str(API_KEY))

        model_url = {
            "german": "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-de-en",
            "italian": "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-it-en",
            "french": "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-fr-en"
        }.get(chosen_language)

        if not model_url:
            raise HTTPException(status_code=400, detail="Unsupported language")

        # Translate text
        translated_chunks = []
        text_chunks = chunk_text(cleaned_text)

        for chunk in text_chunks:
             try:
                 translated = translate_text(chunk, model_url, api_key)
                 translated_chunks.append(translated)
                 print("✅ Translated chunk:", translated)
             except Exception as e:
                 print("❌ Failed to translate chunk:", e)
                 translated_chunks.append("[Translation Error]")

        return {"translatedText": " ".join(translated_chunks)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")
    finally:
        os.remove(file_path)

# cd src, cd backend, then to start server: uvicorn server:app --reload
# or to specify localhost: uvicorn server:app --reload --host 127.0.0.1 --port 3001