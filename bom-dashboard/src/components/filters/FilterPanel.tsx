import React from "react";
import Dropdown from "./Dropdown";
import "./FilterPanel.css";

interface FilterPanelProps {
  filters: {
    company_name: string;
    client_sku_number: string;
    elabs_fg_match_code: string;
    fg_description: string;
    formula_number: string;
    valid_from: string;
  };

  filterOptions: {
    companyNames: string[];
    skuNumbers: string[];
    fgMatchCodes: string[];
    fgDescriptions: string[];
    formulaNumbers: string[];
    validFroms: string[];
  };

  onFilterChange: (
    key: string,
    value: Date | string
  ) => void;

  onClearFilters: () => void;
}

const FilterPanel = ({
  filters,
  filterOptions,
  onFilterChange,
  onClearFilters,
}: FilterPanelProps) => {

  return (

    <div className="filter-panel">

      <div className="filter-section-title">
        Filters
      </div>

      <div className="filter-list">

        <Dropdown
          label="Client Name"
          options={filterOptions.companyNames}
          value={filters.company_name}
          onChange={(value) =>
            onFilterChange(
              "company_name",
              value
            )
          }
        />

        <Dropdown
          label="SKU"
          options={filterOptions.skuNumbers}
          value={filters.client_sku_number}
          onChange={(value) =>
            onFilterChange(
              "client_sku_number",
              value
            )
          }
        />

        <Dropdown
          label="FG Match Code"
          options={filterOptions.fgMatchCodes}
          value={filters.elabs_fg_match_code}
          onChange={(value) =>
            onFilterChange(
              "elabs_fg_match_code",
              value
            )
          }
        />

        <Dropdown
          label="FG Description"
          options={filterOptions.fgDescriptions}
          value={filters.fg_description}
          onChange={(value) =>
            onFilterChange(
              "fg_description",
              value
            )
          }
        />

        <Dropdown
          label="Formula Number"
          options={filterOptions.formulaNumbers}
          value={filters.formula_number}
          onChange={(value) =>
            onFilterChange(
              "formula_number",
              value
            )
          }
        />

        <Dropdown
          label="Valid From"
          options={filterOptions.validFroms}
          value={filters.valid_from}
          onChange={(value) =>
            onFilterChange(
              "valid_from",
              value
            )
          }
        />

      </div>
      <button
        className="clear-btn"
        onClick={onClearFilters}
      >
        Clear all slicers
      </button>

    </div>

  );
};

export default FilterPanel;