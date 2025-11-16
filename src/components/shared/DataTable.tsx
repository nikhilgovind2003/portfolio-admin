import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Loader2, ChevronUp, ChevronDown, Search as SearchIcon } from 'lucide-react';
import { DeleteDialog } from './DeleteDialog';
import { Pagination, PaginationInfo } from './Pagination';
import { Input } from '@/components/ui/input';

export type Column<T> = {
  header: string;
  accessor: keyof T | string | ((row: T) => any);
  cell?: (value: any, row: T, rowIndex: number) => React.ReactNode; // Note rowIndex here!
  sortable?: boolean;
  width?: string; // Optional custom width e.g. '150px', '20%', '10rem'
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  apiPath?: string;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  isLoading?: boolean;
  enableSearch?: boolean;
  showBorders?: boolean;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onDelete,
  apiPath,
  pagination,
  onPageChange,
  onLimitChange,
  isLoading = false,
  enableSearch = false,
  showBorders = false,
}: DataTableProps<T>) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Sort state
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Check if any column has a custom width
  const hasCustomWidths = columns.some(col => !!col.width);

  // Function to get width style for column
  const getColumnWidth = (col: Column<T>) => {
    if (col.width) return col.width;
    // If no columns have custom widths, assign equal widths
    if (!hasCustomWidths) return `${100 / columns.length}%`;
    // If some columns have widths, provide flexible width for others
    return 'auto';
  };

  // Handle sorting toggles
  const onHeaderClick = (col: Column<T>) => {
    if (!col.sortable) return;
    const colKey = typeof col.accessor === 'string' ? col.accessor : null;
    if (!colKey) return;

    if (sortCol === colKey) {
      // toggle direction
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(colKey);
      setSortDir('asc');
    }
  };

  // Filter data by search query
  const searchedData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();

    return data.filter(row =>
      columns.some(col => {
        let value: any;
        if (typeof col.accessor === 'function') {
          value = col.accessor(row);
        } else if (typeof col.accessor === 'string') {
          value = (row as any)[col.accessor];
        }
        if (value === undefined || value === null) return false;
        return String(value).toLowerCase().includes(q);
      })
    );
  }, [searchQuery, data, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortCol) return searchedData;
    const sorted = [...searchedData].sort((a, b) => {
      const aVal = (a as any)[sortCol];
      const bVal = (b as any)[sortCol];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (aStr < bStr) return sortDir === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [searchedData, sortCol, sortDir]);

  // CSS — add border classes conditionally
  const borderClass = showBorders ? 'border border-border' : '';

  return (
    <div className="space-y-4">
      {enableSearch && (
        <div className="mb-2 w-full max-w-sm">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            icon={<SearchIcon className="w-4 h-4 text-muted-foreground" />}
          />
        </div>
      )}

      <div className={`${borderClass} rounded-md bg-card`}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, colIndex) => {
                const colKey = typeof col.accessor === 'string' ? col.accessor : `col-${colIndex}`;
                const isSorted = colKey === sortCol;
                return (
                  <TableHead
                    key={colIndex}
                    className={`${col.sortable ? 'cursor-pointer select-none' : ''} ${showBorders ? 'border border-border' : ''}`}
                    style={{ width: getColumnWidth(col), minWidth: '50px' }}
                    onClick={() => onHeaderClick(col)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span>
                          {isSorted ? (
                            sortDir === 'asc' ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )
                          ) : (
                            <ChevronUp className="opacity-0 w-4 h-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                );
              })}
              {(onEdit || onDelete) && (
                <TableHead
                  className={`${showBorders ? 'border border-border' : ''} text-right`}
                  style={{ width: '80px', minWidth: '50px' }} // fixed width for actions column
                >
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Loading...</p>
                </TableCell>
              </TableRow>
            ) : sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center text-muted-foreground py-8">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, rowIndex) => (
                <TableRow key={row.id}>
                  {columns.map((col, colIndex) => {
                    let value;
                    if (typeof col.accessor === 'function') {
                      value = col.accessor(row);
                    } else {
                      value = (row as any)[col.accessor];
                    }
                    return (
                      <TableCell
                        style={{ width: getColumnWidth(col), minWidth: '50px' }}
                        key={colIndex}
                        className={showBorders ? 'border border-border' : ''}
                      >
                        {col.cell ? col.cell(value, row, rowIndex) : String(value)}
                      </TableCell>
                    );
                  })}

                  {(onEdit || onDelete) && (
                    <TableCell
                      style={{ width: '80px', minWidth: '50px' }}
                      className={`text-right space-x-2 ${showBorders ? 'border border-border' : ''}`}
                    >
                      {onEdit && (
                        <Button variant="ghost" size="icon" onClick={() => onEdit!(row)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}

                      {onDelete && (
                        <DeleteDialog
                          id={Number(row.id)}
                          apiPath={apiPath || ''}
                          onSuccess={() => onDelete(row)}
                        />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Component */}
      {pagination && onPageChange && onLimitChange && (
        <Pagination pagination={pagination} onPageChange={onPageChange} onLimitChange={onLimitChange} />
      )}
    </div>
  );
}
