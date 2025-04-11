"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

const ContextDrawer = ({ contextData, onContextUpdate, question, setQuestion }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [questionBox, setQuestionBox] = useState(0)
  const [contextText, setContextText] = useState(
    typeof contextData === "string" ? contextData : contextData?.summary || "Add spreadsheet context here..."
  )

  // Update local state when contextData prop changes
  useEffect(() => {
    if (typeof contextData === "string") {
      setContextText(contextData)
    }
  }, [contextData])

  // Add event listeners for outside clicks and ESC key
  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target
      if (isOpen && !target.closest(".context-drawer") && !target.closest(".drawer-toggle")) {
        setIsOpen(false)
      }
    }

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

  useEffect(() => {
    console.log("questionsBox is:", questionBox)
    console.log("question is:", question)
  }, [questionBox, question])

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  const handleContextChange = (e) => {
    const newValue = e.target.value
    setContextText(newValue)
    // Auto-save the changes
    if (onContextUpdate) {
      onContextUpdate(newValue)
    }
  }

  function addQuestionBox() {
    //needs to set questionBox state to prev +1
    setQuestionBox((prev) => prev + 1)
  }

  function removeQuestionBox() {
    if (questionBox > 0) {
      setQuestionBox((prev) => prev - 1)

      setQuestion((prevQuestions) => {
        const updatedQuestions = [...prevQuestions]
        updatedQuestions.pop() // Remove the last question in the array
        return updatedQuestions
      })
    }
  }

  function setQuestionHandler(newQuestion, index) {
    setQuestion((prevQuestions) => {
      // Ensure prevQuestions is an array
      if (!Array.isArray(prevQuestions)) {
        prevQuestions = []
      }

      // Clone the previous state
      const updatedQuestions = [...prevQuestions]

      // Ensure the specific index is an array (if needed)
      if (!Array.isArray(updatedQuestions[index])) {
        updatedQuestions[index] = "" // Initialize as an empty string for text input
      }

      // Set the value directly instead of appending
      updatedQuestions[index] = newQuestion

      console.log("Updated questions:", updatedQuestions)
      return updatedQuestions
    })
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
        className="drawer-toggle fixed bottom-0 left-1/2 -translate-x-1/2 bg-white border-t border-x border-teal-200 rounded-t-lg shadow-md w-64 z-50">
        <button
          onClick={toggleDrawer}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 w-full justify-center transition-colors"
          aria-label="Open context drawer"
          aria-expanded="false">
          <span className="text-sm font-medium">Spreadsheet Context</span>
          <ChevronUp className="h-4 w-4 text-teal-500" />
        </button>
      </div>
    )}
    {/* Drawer content */}
    <div
      className={cn(
        "context-drawer fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-teal-200 z-50 transition-all duration-300 ease-in-out",
        isOpen ? "translate-y-0 animate-in slide-in-from-bottom" : "translate-y-full"
      )}
      aria-hidden={!isOpen}
      style={{ display: isOpen ? "block" : "none" }}>
      {/* Toggle button at top of drawer */}
      <div
        className="border-b border-teal-100 py-2 bg-gradient-to-r from-teal-50 to-blue-50">
        <button
          onClick={toggleDrawer}
          className="flex items-center gap-2 px-4 py-1 text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 mx-auto transition-colors"
          aria-label="Close context drawer"
          aria-expanded="true">
          <span className="text-sm font-medium">Spreadsheet Context</span>
          <ChevronDown className="h-4 w-4 text-teal-500" />
        </button>
      </div>

      <div className="px-6 py-5 max-w-4xl mx-auto">
        <div className="mb-3">
          <Label
            htmlFor="spreadsheetContext"
            className="text-base text-slate-800 font-medium">
            Context Notes
          </Label>
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={addQuestionBox}
            className="text-teal-600 hover:bg-teal-50 hover:text-teal-700 border-teal-200 bg-white">
            Add Question
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={removeQuestionBox}
            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-blue-200 bg-white"
            disabled={questionBox === 0}>
            Remove Question
          </Button>
        </div>

        {questionBox > 0 && (
          <div
            className="space-y-3 mb-4 border border-blue-100 rounded-md p-4 bg-gradient-to-r from-blue-50/50 to-teal-50/50">
            <h3 className="text-sm font-medium mb-2 text-slate-700">Questions</h3>
            {[...Array(questionBox)].map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <label className="text-sm text-slate-500 w-28">Question {index + 1}:</label>
                <input
                  value={question[index] || ""}
                  onChange={(e) => setQuestionHandler(e.target.value, index)}
                  className="flex h-9 w-full rounded-md border border-teal-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your question here..." />
              </div>
            ))}
          </div>
        )}

        <div className="py-2">
          <Textarea
            id="spreadsheetContext"
            placeholder="Add notes, context, or any relevant information about this spreadsheet..."
            value={contextText}
            onChange={handleContextChange}
            rows={4}
            className="w-full resize-none border-blue-200 focus-visible:ring-teal-500 text-base min-h-[120px] rounded-md" />
        </div>
      </div>
    </div>
  </>);
}

export default ContextDrawer
