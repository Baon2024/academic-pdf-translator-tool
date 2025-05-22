
import React from "react"
import Select from "react-select"

const MultiSelectDropdown = ({ selectedOptions, setSelectedOptions }) => {
  const options = [
    { value: "german", label: "German" },
    { value: "french", label: "French" },
    { value: "italian", label: "Italian" },
    { value: "latin", label: "latin"}
  ]

  const handleChange = (selected) => {
    setSelectedOptions(selected)
  }

  // Custom styles to match shadcn/ui aesthetic
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: state.isFocused ? "hsl(var(--primary))" : "hsl(var(--border))",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused ? "0 0 0 1px hsl(var(--primary))" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "hsl(var(--primary))" : "hsl(var(--border))",
      },
      padding: "1px",
      fontSize: "0.875rem",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.375rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "hsl(var(--primary))"
        : state.isFocused
        ? "hsl(var(--primary) / 0.1)"
        : null,
      color: state.isSelected ? "hsl(var(--primary-foreground))" : "inherit",
      "&:active": {
        backgroundColor: state.isSelected ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.2)",
      },
      fontSize: "0.875rem",
      padding: "8px 12px",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "hsl(var(--primary) / 0.1)",
      borderRadius: "0.25rem",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "hsl(var(--primary))",
      fontSize: "0.75rem",
      padding: "2px 4px",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "hsl(var(--primary))",
      "&:hover": {
        backgroundColor: "hsl(var(--primary))",
        color: "white",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "hsl(var(--muted-foreground))",
      fontSize: "0.875rem",
    }),
    input: (provided) => ({
      ...provided,
      fontSize: "0.875rem",
    }),
  }

  return (
    <div className="w-full space-y-2">
      <Select
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Select languages..."
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        aria-label="Select languages"
      />
      
      {selectedOptions && selectedOptions.length > 0 && (
        <div className="text-sm text-muted-foreground pt-1">
          <span className="font-medium text-foreground">Selected:</span>{" "}
          {selectedOptions.map((option) => option.label).join(", ")}
        </div>
      )}
    </div>
  )
}

export default MultiSelectDropdown