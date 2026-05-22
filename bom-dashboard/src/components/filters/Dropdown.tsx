import React from "react";
import "./Dropdown.css";
interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}
const Dropdown = ({
  label,
  options,
  value,
  onChange,
}: DropdownProps) => {
  return (
    <div className="filter-dropdown">
      <label className="filter-label">
        {label}
      </label>
      <select
        className="filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">
          All
        </option>
        {options.map((option, index) => (
          <option
            key={index}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;