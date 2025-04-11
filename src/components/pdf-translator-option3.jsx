"use client"

import { useState } from "react"
import { Upload, Download, Loader2, Languages, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PDFTranslator({
  handleSubmit,
  handleSubmitPython,
  handleFileChange,
  downloadTranslationHandler,
  loading,
  error,
  translatedText,
  selectedOptions,
  setSelectedOptions,
  file,
  fileName,
}) {
  // Local state to track the current step
  const [currentStep, setCurrentStep] = useState(1)

  // Determine if we can proceed to the next step
  const canProceedToStep2 = file || fileName

  return (
    (<div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-center mb-8">
        <Languages className="h-8 w-8 mr-2 text-primary" />
        <h1 className="text-3xl font-bold text-center">PDF Translator</h1>
      </div>
      {/* Stepper */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`rounded-full h-10 w-10 flex items-center justify-center ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            1
          </div>
          <div className={`h-1 w-16 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
          <div
            className={`rounded-full h-10 w-10 flex items-center justify-center ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            2
          </div>
          <div className={`h-1 w-16 ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`}></div>
          <div
            className={`rounded-full h-10 w-10 flex items-center justify-center ${currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            3
          </div>
        </div>
      </div>
      {/* Step 1: Upload */}
      {currentStep === 1 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Step 1: Upload PDF Document</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-file" />
              <label
                htmlFor="pdf-file"
                className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-lg font-medium mb-1">{fileName ? fileName : "Choose a PDF file"}</span>
                <span className="text-sm text-muted-foreground">
                  {file ? "Click to change file" : "or drag and drop it here"}
                </span>
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => setCurrentStep(2)} disabled={!canProceedToStep2}>
              Next Step
            </Button>
          </CardFooter>
        </Card>
      )}
      {/* Step 2: Select Languages */}
      {currentStep === 2 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Step 2: Select Target Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <MultiSelectDropdown selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
              <p className="text-sm text-muted-foreground mt-2">
                Select the languages you want to translate your PDF document into.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={!selectedOptions || selectedOptions.length === 0}>
              Next Step
            </Button>
          </CardFooter>
        </Card>
      )}
      {/* Step 3: Translate */}
      {currentStep === 3 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Step 3: Translate Document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Check className="h-5 w-5 text-green-500" />
                <span>
                  PDF document selected: <span className="font-medium">{fileName}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <Check className="h-5 w-5 text-green-500" />
                <span>
                  Languages selected: <span className="font-medium">{selectedOptions?.join(", ")}</span>
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button onClick={handleSubmit} disabled={loading || !file} className="flex-1">
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
                <Button
                  onClick={handleSubmitPython}
                  disabled={loading || !fileName}
                  variant="outline"
                  className="flex-1">
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
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-start">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Back
            </Button>
          </CardFooter>
        </Card>
      )}
      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* Translation Results */}
      {translatedText && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Translation Results</CardTitle>
            <Button
              onClick={downloadTranslationHandler}
              variant="outline"
              size="sm"
              className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              value={translatedText}
              readOnly
              className="min-h-[200px] font-mono resize-none" />
          </CardContent>
        </Card>
      )}
    </div>)
  );
}

// Placeholder for the MultiSelectDropdown component
function MultiSelectDropdown({ selectedOptions, setSelectedOptions }) {
  return (
    (<div className="border rounded-md p-2">
      <div className="flex flex-wrap gap-1">
        {selectedOptions?.length > 0 ? (
          selectedOptions.map((option, index) => (
            <span
              key={index}
              className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
              {option}
            </span>
          ))
        ) : (
          <span className="text-muted-foreground text-sm">Select target languages...</span>
        )}
      </div>
    </div>)
  );
}
