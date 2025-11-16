import { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { PaginationInfo } from '@/components/shared/Pagination';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/types';
import { apiService } from '@/api/apiService';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);


  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAll("contact", {
        page: currentPage,
        limit,
        search: searchQuery,
      });
      setUsers(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    {
      header: 'ID', accessor: 'id',
      cell: (_value: any, _row: any, index: number) => index + 1,
      sortable: true, width: '60px',
    },
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Email', accessor: 'email', sortable: true },
    {
      header: 'Message', accessor: 'message',
      cell: (value: string) => (
        <button
          className="text-left truncate max-w-[200px] text-blue-600 hover:underline"
          style={{ cursor: value ? 'pointer' : 'default' }}
          onClick={e => {
            e.stopPropagation();
            if (value) {
              setSelectedMessage(value);
              setModalOpen(true);
            }
          }}
        >
          {value?.length > 64 ? value.slice(0, 64) + '…' : value || "—"}
        </button>
      )
    },
    {
      header: 'Date', accessor: 'createdAt', sortable: true,
      cell: (value: string) => {
        try {
          return value ? new Date(value).toLocaleDateString("en-IN") : "N/A";
        } catch {
          return "Invalid Date";
        }
      }
    },
  ];

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage registered users</p>
        </div>
      </div>

      {/* External search bar for consistency, or you can enable DataTable's search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        data={users}
        columns={columns}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isLoading={isLoading}
        enableSearch={false} // We handle search externally here
        showBorders={true} // controls border visibility
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Message</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto whitespace-pre-line break-words py-4">
            {selectedMessage}
          </div>
          <DialogFooter>
            <Button variant="primary" className="mt-2" onClick={() => setModalOpen(false)} autoFocus>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
