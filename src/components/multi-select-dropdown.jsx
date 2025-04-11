"use client"
import Select from "react-select"

const MultiSelectDropdown = ({ selectedOptions, setSelectedOptions }) => {
  const options = [
    { value: "german", label: "German" },
    { value: "french", label: "French" },
    { value: "italian", label: "Italian" },
  ]

  const handleChange = (selected) => {
    setSelectedOptions(selected || [])
  }

  // Custom styles to match shadcn/ui aesthetic
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: state.isFocused ? "hsl(215, 100%, 50%)" : "hsl(215, 14%, 85%)",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused ? "0 0 0 1px hsl(215, 100%, 50%)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "hsl(215, 100%, 50%)" : "hsl(215, 14%, 75%)",
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
      backgroundColor: state.isSelected ? "hsl(215, 100%, 50%)" : state.isFocused ? "hsl(215, 100%, 97%)" : null,
      color: state.isSelected ? "white" : "inherit",
      "&:active": {
        backgroundColor: state.isSelected ? "hsl(215, 100%, 50%)" : "hsl(215, 100%, 90%)",
      },
      fontSize: "0.875rem",
      padding: "8px 12px",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "hsl(215, 100%, 95%)",
      borderRadius: "0.25rem",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "hsl(215, 100%, 50%)",
      fontSize: "0.75rem",
      padding: "2px 4px",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "hsl(215, 100%, 50%)",
      "&:hover": {
        backgroundColor: "hsl(215, 100%, 50%)",
        color: "white",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "hsl(215, 14%, 60%)",
      fontSize: "0.875rem",
    }),
    input: (provided) => ({
      ...provided,
      fontSize: "0.875rem",
    }),
  }

  return (
    (<div className="w-full space-y-2">
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Select languages..."
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        aria-label="Select languages" />
      {selectedOptions && selectedOptions.length > 0 && (
        <div className="text-sm text-gray-500 pt-1">
          <span className="font-medium text-gray-700">Selected:</span>{" "}
          {selectedOptions.map((option) => option.label).join(", ")}
        </div>
      )}
    </div>)
  );
}

export default MultiSelectDropdown
