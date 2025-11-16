
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Loader2 } from 'lucide-react';
import { DeleteDialog } from './DeleteDialog';
import { Pagination, PaginationInfo } from './Pagination';

export type Column<T> = {
  header: string;
  accessor: keyof T | string;
  cell?: (value: any, row: T) => React.ReactNode;
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
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
              {(onEdit || onDelete) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-8"
                >
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Loading...</p>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center text-muted-foreground py-8"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column, index) => {
                    const value =
                      typeof column.accessor === 'function'
                        ? column.accessor(row)
                        : row[column.accessor];
                    return (
                      <TableCell key={index}>
                        {column.cell ? column.cell(value, row) : String(value)}
                      </TableCell>
                    );
                  })}

                  {(onEdit || onDelete) && (
                    <TableCell className="text-right space-x-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(row)}
                        >
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
        <Pagination
          pagination={pagination}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}