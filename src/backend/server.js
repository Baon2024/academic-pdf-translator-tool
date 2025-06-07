import express from 'express';
import multer from 'multer';
import path from 'path';
import pdfParse from 'pdf-parse'; // For text extraction
import fs from 'fs';
import cors from 'cors';
import { pipeline } from '@xenova/transformers'; // ✅ correct
import dotenv from 'dotenv';
import { translateText, chunkText } from './backendFunctions.js';
import { Client } from "@gradio/client";

dotenv.config();


const app = express();
const port = 5005;



const apiKey = process.env.HF_TOKEN;

//app.use(cors());
app.use(cors({ origin: 'http://localhost:3002' })); // Allow specific origin



import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up Multer for file uploads
const upload = multer({
  dest: path.join(__dirname, 'uploads'),  // Use absolute path here!
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: PDFs only!"));  // Pass Error object here for clarity
    }
  },
});

// Route to handle PDF uploads and translation
app.post("/translate-pdf", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  

    console.log("backend is:", req.body);
    const pdfBuffer = fs.readFileSync(req.file.path);
    console.log("pdfBuffer in backend is:", pdfBuffer);

    const languageToTranslate = await JSON.parse(req.body.language);
    console.log("language to translate is:", languageToTranslate);
    const chosenLanguage = languageToTranslate.value;
    console.log("chosenLanguage value:", chosenLanguage);

    // Extract text from the PDF
    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text;
    const cleanedText = text.replace(/\s+/g, ' ').trim();
    console.log("text in backend is:", text);

    // Translate text using Hugging Face Inference API
    
    let modelUrl;
    let task;
     
    if (chosenLanguage === 'german') {
      modelUrl = "Helsinki-NLP/opus-mt-de-en";
      task = 'translation_de_to_en'
    } else if (chosenLanguage === 'latin') {
      modelUrl = 'Helsinki-NLP/opus-mt-la-en';
      task = 'translation_la_to_en'
    } else if (chosenLanguage === 'italian') {
      modelUrl = "Helsinki-NLP/opus-mt-it-en";
      task = 'translation_it_to_en'
    } else if (chosenLanguage === 'french') {
      modelUrl = "Helsinki-NLP/opus-mt-fr-en";
      task = 'translation_fr_to_en'
    }

    //can obviously add conditional logic, to determine model based on whcih langage is displayed in front-end

    console.log("modelUrl before being passed down to function is:", modelUrl);
    const { pdfPath } = req.body;

    try {
      /*const pdfText = extractTextFromPDF(pdfPath);*/
      const translatedChunks = [];
  
      const textChunks = chunkText(/*pdfText*/ cleanedText);
      console.log("textChunks are:", textChunks);
      
      console.log("task before translation is: ", task, "and modelUrl is: ", modelUrl);


      for (const chunk of textChunks) {
        console.log("sending each chunk to gradio space for translation!")
        //add in new code for js pipeline
        //task, modelUrl
        const client = await Client.connect("http://127.0.0.1:7861/");
        const result = await client.predict("/predict", { 		
          task: task, 		
          modelUrl: modelUrl, 		
          chunk_to_translate: chunk, 
        });

        console.log("translated chunk is: ", result.data);



        translatedChunks.push(result.data);

        //const translatedText = await translateText(chunk, modelUrl, apiKey);
        //console.log("translatedText:", translateText);
        //translatedChunks.push(translatedText);
      }
      console.log("translatedChunks are:", translatedChunks);

      res.json({
        translatedText: translatedChunks.join(' '),
      });
    } catch (error) {
      res.status(500).json({ error: 'Translation failed' });
    }
  });

  app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
  }).on('error', (err) => {
    console.error('🛑 Failed to start server:', err);
  });
