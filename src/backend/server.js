const express = require("express");
const multer = require("multer");
const path = require("path");
const pdfParse = require("pdf-parse"); // For text extraction
const fs = require('fs');
const { translateText, chunkText } = require('./backendFunctions');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

const apiKey = process.env.HF_TOKEN;

app.use(cors());

// Set up Multer for file uploads
const upload = multer({
  dest: "uploads/", // Temporary storage for uploaded files
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: PDFs only!");
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
     
    if (chosenLanguage === 'german') {
      modelUrl = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-de-en";
    } else if (chosenLanguage === 'italian') {
      modelUrl = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-it-en";
    } else if (chosenLanguage === 'french') {
      modelUrl = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-fr-en";
      //https://router.huggingface.co/hf-inference/models/Helsinki-NLP/opus-mt-fr-en
    }

    //can obviously add conditional logic, to determine model based on whcih langage is displayed in front-end

    console.log("modelUrl before being passed down to function is:", modelUrl);
    const { pdfPath } = req.body;

    try {
      /*const pdfText = extractTextFromPDF(pdfPath);*/
      const translatedChunks = [];
  
      const textChunks = chunkText(/*pdfText*/ cleanedText);
      console.log("textChunks are:", textChunks);
      for (const chunk of textChunks) {
        const translatedText = await translateText(chunk, modelUrl, apiKey);
        console.log("translatedText:", translateText);
        translatedChunks.push(translatedText);
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
  console.log(`Server running at http://localhost:${port}`);
});
