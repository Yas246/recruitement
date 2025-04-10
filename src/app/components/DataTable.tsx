"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useIsMobile } from "../utils/responsive";
import Pagination from "./Pagination";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  width?: string;
  cellClassName?: string;
  renderCell?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  title?: string;
  description?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchField?: (item: T) => string;
  pagination?: boolean;
  pageSize?: number;
  actions?: React.ReactNode;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selectedRows?: T[];
  setSelectedRows?: React.Dispatch<React.SetStateAction<T[]>>;
  isSelectable?: boolean;
  checkboxSelection?: boolean;
  containerClassName?: string;
  className?: string;
}

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  title,
  description,
  searchable = false,
  searchPlaceholder = "Rechercher...",
  searchField,
  pagination = true,
  pageSize = 10,
  actions,
  emptyMessage = "Aucune donnée disponible",
  onRowClick,
  selectedRows,
  setSelectedRows,
  isSelectable = false,
  checkboxSelection = false,
  containerClassName = "",
  className = "",
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const isMobile = useIsMobile();

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm) return data;

    return data.filter((item) => {
      if (searchField) {
        return searchField(item)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }

      // Default search through all string fields
      return Object.entries(item as Record<string, any>).some(([_, value]) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (typeof value === "number") {
          return value.toString().includes(searchTerm);
        }
        return false;
      });
    });
  }, [data, searchTerm, searchable, searchField]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      // Type guard to handle function accessor separately
      const aValue = (() => {
        if (sortConfig.key === null) return null;
        if (typeof sortConfig.key === "string") {
          return a[sortConfig.key];
        }
        return null; // We can't sort on function accessors
      })();

      const bValue = (() => {
        if (sortConfig.key === null) return null;
        if (typeof sortConfig.key === "string") {
          return b[sortConfig.key];
        }
        return null; // We can't sort on function accessors
      })();

      if (aValue === bValue) return 0;

      // Handle different data types
      if (typeof aValue === "string" && typeof bValue === "string") {
        const result = aValue.localeCompare(bValue);
        return sortConfig.direction === "asc" ? result : -result;
      }

      if (aValue === null || aValue === undefined)
        return sortConfig.direction === "asc" ? -1 : 1;
      if (bValue === null || bValue === undefined)
        return sortConfig.direction === "asc" ? 1 : -1;

      // Default comparison
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;

      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!pagination) return 1;
    return Math.ceil(sortedData.length / pageSize);
  }, [sortedData, pageSize, pagination]);

  // Handle row selection
  const handleSelectRow = (row: T) => {
    if (!isSelectable || !setSelectedRows) return;

    setSelectedRows((prev) => {
      const isSelected = prev.some((r) => r[keyField] === row[keyField]);
      if (isSelected) {
        return prev.filter((r) => r[keyField] !== row[keyField]);
      } else {
        return [...prev, row];
      }
    });
  };

  const isRowSelected = (row: T) => {
    if (!selectedRows) return false;
    return selectedRows.some((r) => r[keyField] === row[keyField]);
  };

  // Handle sort
  const handleSort = (columnKey: keyof T | ((row: T) => React.ReactNode)) => {
    if (typeof columnKey === "function") return; // Can't sort on complex cell renderers

    setSortConfig((current) => {
      if (current.key === columnKey) {
        return {
          key: columnKey,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return {
        key: columnKey,
        direction: "asc",
      };
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Render sort indicator
  const renderSortIndicator = (column: Column<T>) => {
    if (!column.sortable) return null;
    if (typeof column.accessor === "function") return null;

    if (sortConfig.key === column.accessor) {
      return sortConfig.direction === "asc" ? (
        <span className="ml-1">▲</span>
      ) : (
        <span className="ml-1">▼</span>
      );
    }

    return <span className="ml-1 text-gray-300">▲</span>;
  };

  // Row click handler
  const handleRowClick = (row: T) => {
    if (checkboxSelection) return; // Don't trigger row click when in checkbox selection mode
    if (onRowClick) {
      onRowClick(row);
    } else if (isSelectable && setSelectedRows) {
      handleSelectRow(row);
    }
  };

  const renderCellContent = (column: Column<T>, row: T) => {
    const cellValue =
      typeof column.accessor === "function"
        ? column.accessor(row)
        : row[column.accessor];

    if (column.renderCell) {
      return column.renderCell(cellValue, row);
    }

    // Handle different types of cell values
    if (cellValue === null || cellValue === undefined) {
      return "—";
    }

    // React nodes can be rendered directly
    if (React.isValidElement(cellValue)) {
      return cellValue;
    }

    // Convert to string for display
    return String(cellValue);
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow ${containerClassName}`}
    >
      {/* Header section */}
      {(title || searchable || actions) && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            {/* Title and description */}
            {title && (
              <div className="mb-3 sm:mb-0">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h2>
                {description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Search and actions */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {searchable && (
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {actions && (
                <div className="flex space-x-2 ml-auto">{actions}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table section */}
      <div className={`overflow-x-auto ${className}`}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {checkboxSelection && (
                <th scope="col" className="w-12 px-4 py-3">
                  {/* Select all checkbox would go here */}
                </th>
              )}

              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.sortable
                      ? "cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800"
                      : ""
                  } ${column.width || ""}`}
                  onClick={() =>
                    column.sortable &&
                    typeof column.accessor !== "function" &&
                    handleSort(column.accessor)
                  }
                >
                  <div className="flex items-center">
                    {column.header}
                    {renderSortIndicator(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => {
                const isSelected = isRowSelected(row);
                return (
                  <tr
                    key={String(row[keyField])}
                    onClick={() => handleRowClick(row)}
                    className={`${
                      onRowClick || isSelectable
                        ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        : ""
                    } ${isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                  >
                    {checkboxSelection && (
                      <td className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                    )}

                    {columns.map((column, cellIndex) => {
                      return (
                        <td
                          key={cellIndex}
                          className={`px-4 py-3 whitespace-nowrap ${
                            column.cellClassName ||
                            "text-sm text-gray-900 dark:text-gray-200"
                          }`}
                        >
                          {renderCellContent(column, row)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (checkboxSelection ? 1 : 0)}
                  className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination section */}
      {pagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:flex sm:items-center sm:justify-between">
          <div className="hidden sm:block flex-1 text-sm text-gray-700 dark:text-gray-400">
            Affichage de {(currentPage - 1) * pageSize + 1} à{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} sur{" "}
            {sortedData.length} éléments
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default DataTable;
