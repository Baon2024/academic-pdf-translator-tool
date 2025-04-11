'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import MultiSelectDropdown from "./dropdownSelector";
import jsPDF from "jspdf";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, Loader2, Languages, ArrowRight, FileText, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [file, setFile] = useState(null); // State to hold the uploaded file
  const [translatedText, setTranslatedText] = useState(""); // State to hold the translated text
  const [loading, setLoading] = useState(false); // State to show a loading spinner
  const [error, setError] = useState(""); // State to handle errors
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [ fileName, setFileName ] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    //console.log("file is:", file);
    //setFileName(file.name);
  };

  useEffect(() => {
    console.log("file is:", file)
    setFileName(file?.name);
  },[file])

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append('language', JSON.stringify(selectedOptions));

      //create object to pass formData and language
      //const objectToPass = { formData: formData, language: selectedOptions}

      // Make a POST request to your backend
      const response = await fetch("http://localhost:3001/translate-pdf", {
        method: "POST",
        body: formData, // Pass the FormData directly - I also want to be able to pass the decoding language choice
      });
      
      console.log("response is:", response);

      if (!response.ok) {
        throw new Error("Failed to translate the PDF");
      }
      
      console.log("response is:", response);
      // Parse the response as JSON
      const data = await response.json();
      console.log("data returned to frontend is:", data);
  
      // Update the translated text state
      setTranslatedText(data.translatedText);
    } catch (err) {
      setError("Failed to translate the PDF. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPython = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append('language', JSON.stringify(selectedOptions));

      //create object to pass formData and language
      //const objectToPass = { formData: formData, language: selectedOptions}

      // Make a POST request to your backend
      const response = await fetch("http://localhost:3001/translate-pdf-python", {
        method: "POST",
        body: formData, // Pass the FormData directly - I also want to be able to pass the decoding language choice
      });
      
      console.log("response is:", response);

      if (!response.ok) {
        throw new Error("Failed to translate the PDF");
      }
      
      console.log("response is:", response);
      // Parse the response as JSON
      const data = await response.json();
      console.log("data returned to frontend is:", data);
  
      // Update the translated text state
      setTranslatedText(data.translatedText);
      //have another local data state hook, to allow download as pdf
    } catch (err) {
      setError("Failed to translate the PDF. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  async function downloadTranslationHandler() {
    const doc = new jsPDF();

    // Split text into lines if it's long
    const lines = doc.splitTextToSize(translatedText, 180);
    doc.text(lines, 10, 10); // (text, x, y)

    doc.save("translated_text.pdf");
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl ">
      <div className="flex items-center justify-center mb-8">
        <Languages className="h-8 w-8 mr-2 text-primary" />
        <h1 className="text-3xl font-bold text-center">PDF Translator</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Panel: Upload and Settings */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                PDF Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-file" />
                <label htmlFor="pdf-file" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-lg font-medium mb-1">{fileName ? fileName : "Choose a PDF file"}</span>
                  <span className="text-sm text-muted-foreground">
                    {file ? "Click to change file" : "or drag and drop it here"}
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Translation Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="text-sm font-medium">Target Languages</label>
                <MultiSelectDropdown selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button onClick={handleSubmit} disabled={loading || !file} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Translate
                  </>
                )}
              </Button>
              <Button onClick={handleSubmitPython} disabled={loading || !fileName} variant="outline" className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Translate with Python
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Panel: Results */}
        <div>
          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Translation Results */}
          {translatedText ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">Translation Results</CardTitle>
                <Button
                  onClick={downloadTranslationHandler}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Download as PDF
                </Button>
              </CardHeader>
              <CardContent className="flex-grow">
                <Textarea value={translatedText} readOnly className="min-h-[400px] h-full font-mono resize-none" />
              </CardContent>
            </Card>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Translation Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a PDF document and click translate to see the results here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
