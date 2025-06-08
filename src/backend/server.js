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
import { PassThrough } from 'stream';
import compression from 'compression';

dotenv.config();


const app = express();
const port = 5005;



const apiKey = process.env.HF_TOKEN;

//app.use(cors());
app.use(cors({ origin: 'http://localhost:3002' })); // Allow specific origin
app.use(compression({ threshold: 0}));



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
  res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    const encoder = new TextEncoder();
    const passThrough = new PassThrough();
    // Send initial connection message
    passThrough.pipe(res);


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
    passThrough.write("update: text extracted!\n\n")
    res.flush()

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

    passThrough.write("update: model and task chosen!\n\n")
    res.flush()

    try {
      /*const pdfText = extractTextFromPDF(pdfPath);*/
      const translatedChunks = [];
  
      const textChunks = chunkText(/*pdfText*/ cleanedText);
      console.log("textChunks are:", textChunks);
      
      console.log("task before translation is: ", task, "and modelUrl is: ", modelUrl);
      passThrough.write("update: text chunked!\n\n")
      res.flush()


      for (let idx = 0; idx < textChunks.length; idx++) {
        let chunk = textChunks[idx];
        console.log(`sending chunk ${idx} to gradio space for translation!`)
        passThrough.write(`update: translating ${(idx / textChunks.length) * 100}%\n\n`)
        res.flush()
        //add in new code for js pipeline
        //task, modelUrl
        const client = await Client.connect("Baon2024/academic-translation");
        const result = await client.predict("/predict", { 		
          task: task, 		
          modelUrl: modelUrl, 		
          chunk_to_translate: chunk, 
        });

        console.log("translated chunk is: ", result.data);



        translatedChunks.push(result.data);



      } 
      console.log("translatedChunks are:", translatedChunks);

      passThrough.write(`translation: ${translatedChunks.join(' ')}\n\n`)
      res.flush()
      res.end()

      /*res.json({
        translatedText: translatedChunks.join(' '),
      });*/
    } catch (err) {
      console.error("❌ Translation error:", err);  // full error log
      return res.status(500).json({ error: "translation failed", details: err.message || err });
    }
  });

  app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
  }).on('error', (err) => {
    console.error('🛑 Failed to start server:', err);
  });
