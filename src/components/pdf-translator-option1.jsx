"use client"
import { Upload, Download, Loader2, Languages, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MultiSelectDropdown from "./multi-select-dropdown"

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
  return (
    (<div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-center mb-8">
        <Languages className="h-8 w-8 mr-2 text-primary" />
        <h1 className="text-3xl font-bold text-center">PDF Translator</h1>
      </div>
      <Card className="mb-6">
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

            {/* Language Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Languages</label>
              <MultiSelectDropdown selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
            </div>

            {/* Translation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
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
      </Card>
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
            <CardTitle className="text-xl">Translated Text</CardTitle>
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
