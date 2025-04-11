"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutGrid, Rows, StepForward, Columns } from "lucide-react"

// Import all UI options
import Option1 from "./pdf-translator-option1"
import Option2 from "./pdf-translator-option2"
import Option3 from "./pdf-translator-option3"
import Option4 from "./pdf-translator-option4"

export default function PDFTranslatorToggle(props) {
  const [currentLayout, setCurrentLayout] = useState("option1")

  // Map of layout options with their components and icons
  const layoutOptions = {
    option1: {
      component: Option1,
      label: "Card Layout",
      icon: LayoutGrid,
      description: "Clean, straightforward design with a logical flow",
    },
    option2: {
      component: Option2,
      label: "Tabbed Interface",
      icon: Rows,
      description: "Separates settings from file upload for a cleaner interface",
    },
    option3: {
      component: Option3,
      label: "Stepper Interface",
      icon: StepForward,
      description: "Guides users through a clear step-by-step process",
    },
    option4: {
      component: Option4,
      label: "Split Panel",
      icon: Columns,
      description: "Shows input and output side-by-side",
    },
  }

  // Get the current component to render
  const CurrentComponent = layoutOptions[currentLayout].component

  return (
    (<div className="container mx-auto py-4 px-4 max-w-6xl">
      {/* Layout Selector */}
      <div
        className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/30 p-4 rounded-lg">
        <div>
          <h2 className="text-lg font-medium mb-1">UI Layout Options</h2>
          <p className="text-sm text-muted-foreground">{layoutOptions[currentLayout].description}</p>
        </div>

        <div className="flex gap-2">
          {/* Mobile Dropdown */}
          <div className="sm:hidden w-full">
            <Select value={currentLayout} onValueChange={setCurrentLayout}>
              <SelectTrigger>
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(layoutOptions).map(([key, { label, icon: Icon }]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Button Group */}
          <div className="hidden sm:flex bg-background rounded-md p-1 border">
            {Object.entries(layoutOptions).map(([key, { label, icon: Icon }]) => (
              <Button
                key={key}
                variant={currentLayout === key ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentLayout(key)}
                className="flex items-center gap-1">
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Render the selected UI option */}
      <CurrentComponent {...props} />
    </div>)
  );
}
