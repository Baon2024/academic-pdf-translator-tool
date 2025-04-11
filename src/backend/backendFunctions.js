const fs = require('fs');
const pdfParse = require('pdf-parse');

// Function to extract text from PDF
function extractTextFromPDF(pdfPath) {
  const pdfBuffer = fs.readFileSync(pdfPath);

  pdfParse(pdfBuffer).then(function (data) {
    // Print the text extracted from the PDF
    console.log("Extracted Text:", data.text);
    return data.text;  // Return the extracted text
  }).catch((err) => {
    console.error("Error extracting text:", err);
  });
}

function chunkText(text, maxLength = 512) {
    const words = text.split(' ');
    const chunks = [];
    let currentChunk = [];
  
    words.forEach((word) => {
      currentChunk.push(word);
      if (currentChunk.join(' ').length > maxLength) {
        chunks.push(currentChunk.join(' '));
        currentChunk = [];
      }
    });
  
    if (currentChunk.length) {
      chunks.push(currentChunk.join(' '));
    }
  
    return chunks;
  }


  async function processAndTranslatePDF(pdfPath) {
    const pdfText = extractTextFromPDF(pdfPath);
    const textChunks = chunkText(pdfText);
    
    for (const chunk of textChunks) {
      await translateText(chunk);
    }
}
  



  async function translateText(text, modelUrl, apiKey) {
    try {
        const response = await fetch(modelUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json', // Ensure correct content type for JSON request
          },
          body: JSON.stringify({ inputs: text }), // Send the text to be translated
        });
    
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log("data in general:", data);
        console.log("Translation:", data[0].translation_text);  // Log the translation
        return data[0].translation_text;
      } catch (error) {
        console.error("Error during translation:", error);
      }}

module.exports = {translateText, chunkText, extractTextFromPDF, processAndTranslatePDF };