import React, { useMemo, useState } from "react";
import "./Table.css";

interface Column {
  header: string;
  accessor: string;
}

interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
  onCellClick: (
    accessor: string,
    value: string
  ) => void;
}

const Table = ({
  columns,
  data,
  onCellClick,
}: TableProps) => {
  const [colFilters, setColFilters] =
    useState<Record<string, string>>({});

  const [openFilter, setOpenFilter] =
    useState<string | null>(null);

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.every((col) => {
        const filterValue =
          colFilters[col.accessor];

        if (!filterValue) return true;

        return (
          String(
            row[col.accessor] ?? ""
          ) === filterValue
        );
      })
    );
  }, [data, columns, colFilters]);

  const getColumnOptions = (
    accessor: string
  ) => {
    const rowsWithoutCurrentFilter =
      data.filter((row) =>
        columns.every((col) => {
          if (col.accessor === accessor)
            return true;

          const filterValue =
            colFilters[col.accessor];

          if (!filterValue) return true;

          return (
            String(
              row[col.accessor] ?? ""
            ) === filterValue
          );
        })
      );

    return [
      ...new Set(
        rowsWithoutCurrentFilter
          .map((row) =>
            String(row[accessor] ?? "")
          )
          .filter(Boolean)
      ),
    ].sort();
  };

  const setFilter = (
    accessor: string,
    value: string
  ) => {
    setColFilters((prev) => ({
      ...prev,
      [accessor]: value,
    }));

    setOpenFilter(null);
  };

  const clearFilter = (
    accessor: string
  ) => {
    setColFilters((prev) => {
      const updated = { ...prev };

      delete updated[accessor];

      return updated;
    });

    setOpenFilter(null);
  };

  const clearAllFilters = () => {
    setColFilters({});
    setOpenFilter(null);
  };

  return (
    <>
      <div
        className="table-container"
        onClick={() =>
          setOpenFilter(null)
        }
      >
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                {columns.map((col) => {
                  const isFiltered =
                    !!colFilters[
                      col.accessor
                    ];

                  const isOpen =
                    openFilter ===
                    col.accessor;

                  return (
                    <th
                      key={col.accessor}
                    >
                      <div className="th-inner">
                        <span className="th-label">
                          {col.header}
                        </span>

                        <button
                          className={`filter-icon-btn ${
                            isFiltered
                              ? "active"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();

                            setOpenFilter(
                              isOpen
                                ? null
                                : col.accessor
                            );
                          }}
                        >
                          ▾
                        </button>
                      </div>

                      {isOpen && (
                        <div
                          className="col-filter-dropdown"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >
                          <div
                            className="col-filter-option col-filter-clear"
                            onClick={() =>
                              clearFilter(
                                col.accessor
                              )
                            }
                          >
                            Clear Filter
                          </div>

                          {getColumnOptions(
                            col.accessor
                          ).map((opt) => (
                            <div
                              key={opt}
                              className={`col-filter-option ${
                                colFilters[
                                  col.accessor
                                ] === opt
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() =>
                                setFilter(
                                  col.accessor,
                                  opt
                                )
                              }
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredData.map(
                (row, rowIndex) => (
                <tr 
                key={rowIndex}
                onClick={() => {
                  if (
                    row.unique_id !== undefined
                  ) {
                    window.location.href = `/drillthrough?id=${row.unique_id}`;}
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                  >
                    {columns.map((col) => (
                      <td
                       key={col.accessor}
                       className="clickable-cell"
                       onClick={(e) => {
                         e.stopPropagation();
                         onCellClick(
                          col.accessor,
                          row[
                            col.accessor]
                          );
                        }}>
                          {
                          row[
                            col.accessor
                          ]
                          }
                          </td>
                        ))}
                        </tr>
                        )
                        )}
                        {filteredData.length ===
                        0 && (
                        <tr>
                          <td
                          colSpan={
                            columns.length
                          }
                          className="no-data"
                          >
                            No records found
                            </td>
                            </tr>
                          )}
                         </tbody>
                    </table>
                </div>
          </div>

      <div className="table-actions">
        <button
          className="clear-all-btn"
          onClick={clearAllFilters}
        >
          Clear All Slicers
        </button>
      </div>
    </>
  );
};

export default Table;