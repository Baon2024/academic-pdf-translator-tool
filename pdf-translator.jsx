"use client"

import { useState } from "react"
import { Upload, Download, Loader2, Languages, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
}) {
  const [fileName, setFileName] = useState(null)

  // Wrapper for file change to capture filename
  const handleFileChangeWithName = (e) => {
    handleFileChange(e)
    setFileName(e.target.files[0]?.name || null)
  }

  return (
    (<div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-center mb-8">
        <Languages className="h-8 w-8 mr-2 text-primary" />
        <h1 className="text-3xl font-bold text-center">PDF Translator</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Upload PDF Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChangeWithName}
                className="hidden"
                id="pdf-file" />
              <label
                htmlFor="pdf-file"
                className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-lg font-medium mb-1">{fileName ? fileName : "Choose a PDF file"}</span>
                <span className="text-sm text-muted-foreground">
                  {fileName ? "Click to change file" : "or drag and drop it here"}
                </span>
              </label>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Languages</label>
              <MultiSelectDropdown selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
            </div>

            {/* Translation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button onClick={handleSubmit} disabled={loading || !fileName} className="flex-1">
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
      </Card>
      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* Translation Results */}
      {translatedText && (
        <Card className="mt-6">
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
            <Tabs defaultValue="preview">
              <TabsList className="mb-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-0">
                <div className="bg-muted/50 rounded-md p-4 max-h-[400px] overflow-y-auto">
                  <div className="whitespace-pre-wrap font-mono text-sm">{translatedText}</div>
                </div>
              </TabsContent>
              <TabsContent value="text" className="mt-0">
                <Textarea
                  value={translatedText}
                  readOnly
                  className="min-h-[400px] font-mono resize-none" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>)
  );
}

// Placeholder for the MultiSelectDropdown component
// This would be replaced with your actual implementation
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
