"use client"
import { Upload, Download, Loader2, Languages, ArrowRight, FileText, Settings } from "lucide-react"
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
  return (
    (<div className="container mx-auto py-8 px-4 max-w-6xl">
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
              <Button
                onClick={handleSubmitPython}
                disabled={loading || !fileName}
                variant="outline"
                className="w-full">
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
            <Card className="h-full">
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
                  className="min-h-[400px] font-mono resize-none" />
              </CardContent>
            </Card>
          ) : (
            <div
              className="h-full flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
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
