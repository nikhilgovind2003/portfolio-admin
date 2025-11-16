import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { FormDialog, FormFieldConfig } from '@/components/shared/FormDialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserFormData } from '@/schemas/userSchema';
import { PaginationInfo } from '@/components/shared/Pagination'; // <-- add this import
import { Input } from '@/components/ui/input'; // <-- for search bar

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'inactive';
}

const formFields: FormFieldConfig[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'John Doe' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
  { 
    name: 'role', 
    label: 'Role', 
    type: 'select',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Moderator', value: 'moderator' },
      { label: 'User', value: 'user' },
    ]
  },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ]
  },
];

const Users = () => {
  // PAGINATION & SEARCH STATE
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

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
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]); // paginated users

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      status: 'active',
    },
  });

  // EFFECT: Update displayedUsers whenever users/pagination/search changes
  useEffect(() => {
    let filtered = users;
    if (searchQuery) {
      filtered = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    const start = (currentPage - 1) * limit;
    const end = start + limit;
    setDisplayedUsers(filtered.slice(start, end));
    setPagination({
      currentPage,
      itemsPerPage: limit,
      totalItems: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage < Math.ceil(filtered.length / limit),
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      nextPage: currentPage < Math.ceil(filtered.length / limit) ? currentPage + 1 : null,
    });
  }, [users, currentPage, limit, searchQuery]);

  const columns = [
    { header: 'Name', accessor: 'name' as keyof User },
    { header: 'Email', accessor: 'email' as keyof User },
    { 
      header: 'Role', 
      accessor: 'role' as keyof User,
      cell: (value: string) => <Badge variant="outline">{value}</Badge>
    },
    { 
      header: 'Status', 
      accessor: 'status' as keyof User,
      cell: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
  ];

  const handleSubmit = (data: UserFormData) => {
    const userData: User = {
      id: editingUser?.id || crypto.randomUUID(),
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
    };

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? userData : u));
      toast.success('User updated successfully');
    } else {
      setUsers([...users, userData]);
      toast.success('User created successfully');
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.reset(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setUsers(users.filter(u => u.id !== user.id));
    toast.success('User deleted successfully');
  };

  const resetForm = () => {
    form.reset({
      name: '',
      email: '',
      role: 'user',
      status: 'active',
    });
    setEditingUser(null);
  };

  // PAGE CHANGE HANDLER
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // LIMIT CHANGE HANDLER
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when limit changes
  };

  // SEARCH HANDLER
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage registered users</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* PAGINATED DATA TABLE */}
      <DataTable
        data={displayedUsers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isLoading={false}
      />

      <FormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
        title={editingUser ? 'Edit User' : 'Add New User'}
        description={editingUser ? 'Update user information' : 'Create a new user account'}
        form={form}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        submitLabel={editingUser ? 'Update' : 'Create'}
        fields={formFields}
      />
    </div>
  );
};

export default Users;
