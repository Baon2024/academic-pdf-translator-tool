"use client";
import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function SpreadsheetContextDrawer({
  initialContextText = "",
  initialQuestions = [],
  onContextChange,
  onQuestionsChange
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [contextText, setContextText] = useState(initialContextText)
  const [questions, setQuestions] = useState(initialQuestions)

  useEffect(() => {
    // Add event listener to handle clicking outside the drawer to close it
    const handleClickOutside = (e) => {
      const target = e.target
      if (isOpen && !target.closest(".context-drawer") && !target.closest(".drawer-toggle")) {
        setIsOpen(false)
      }
    }

    // Add event listener to handle ESC key to close drawer
    const handleEscKey = (e) => {
      if (isOpen && e.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscKey)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscKey)
    };
  }, [isOpen])

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  const handleContextChange = (e) => {
    setContextText(e.target.value)
    onContextChange?.(e.target.value)
  }

  const addQuestionBox = () => {
    const newQuestions = [...questions, ""]
    setQuestions(newQuestions)
    onQuestionsChange?.(newQuestions)
  }

  const removeQuestionBox = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index)
    setQuestions(newQuestions)
    onQuestionsChange?.(newQuestions)
  }

  const setQuestionHandler = (value, index) => {
    const newQuestions = [...questions]
    newQuestions[index] = value
    setQuestions(newQuestions)
    onQuestionsChange?.(newQuestions)
  }

  return (<>
    {/* Backdrop overlay when drawer is open */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        aria-hidden="true" />
    )}
    {/* Toggle button when drawer is closed */}
    {!isOpen && (
      <div
        className="drawer-toggle fixed bottom-0 left-1/2 -translate-x-1/2 bg-background border-t border-x border-border rounded-t-lg shadow-md w-64 z-50">
        <button
          onClick={toggleDrawer}
          className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full justify-center transition-colors"
          aria-label="Open context drawer"
          aria-expanded="false">
          <span className="text-sm font-medium">Spreadsheet Context</span>
          <ChevronUp className="h-4 w-4 text-primary" />
        </button>
      </div>
    )}
    {/* Drawer content */}
    <div
      className={cn(
        "context-drawer fixed bottom-0 left-0 right-0 bg-background shadow-lg border-t border-border z-50 transition-all duration-300 ease-in-out",
        isOpen ? "translate-y-0 animate-in slide-in-from-bottom" : "translate-y-full"
      )}
      aria-hidden={!isOpen}>
      {/* Toggle button at top of drawer */}
      <div className="border-b border-border py-2 sticky top-0 bg-background">
        <button
          onClick={toggleDrawer}
          className="flex items-center gap-2 px-4 py-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mx-auto transition-colors"
          aria-label="Close context drawer"
          aria-expanded="true">
          <span className="text-sm font-medium">Spreadsheet Context</span>
          <ChevronDown className="h-4 w-4 text-primary" />
        </button>
      </div>

      <div className="px-6 py-5 max-w-4xl mx-auto">
        <div className="mb-3">
          <Label htmlFor="spreadsheetContext" className="text-base font-medium">
            Context Notes
          </Label>
        </div>

        <div className="py-2">
          <Textarea
            id="spreadsheetContext"
            placeholder="Add notes, context, or any relevant information about this spreadsheet..."
            value={contextText}
            onChange={handleContextChange}
            rows={4}
            className="w-full resize-none focus-visible:ring-primary text-base min-h-[120px]" />
        </div>

        <div className="mt-6 mb-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Questions</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={addQuestionBox}
              className="text-primary hover:text-primary-foreground hover:bg-primary">
              <Plus className="h-4 w-4 mr-1" />
              Add Question
            </Button>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="text-muted-foreground text-sm py-2 italic">
            No questions added yet. Click "Add Question" to create one.
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {questions.map((question, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-1">
                  <Input
                    value={question}
                    onChange={(e) => setQuestionHandler(e.target.value, index)}
                    placeholder="Enter your question here..."
                    className="w-full" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestionBox(index)}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  aria-label="Remove question">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </>);
}
