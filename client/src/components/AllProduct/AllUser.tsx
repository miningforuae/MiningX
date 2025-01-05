'use client'
import React, { useState } from 'react';
import { 
  Trash2, 
  Search, 
  UserCircle2,
  MapPin,
  Mail,
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useUsers } from '@/hooks/Userdetail';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

interface User {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  role?: string;
  createdAt?: string;
}

interface UseUsersReturn {
  users: User[];
  deleteUser: (userId: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export default function AllUsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { users, deleteUser, isLoading, error } = useUsers() as UseUsersReturn;
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth as AuthState
  );

  const filteredUsers = users?.filter(user => 
    (user.firstName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (user.lastName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (user.email || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (user.country || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  ) || [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      toast.success('User deleted successfully');
    } else {
      toast.error('Failed to delete user');
    }
  };

  const handleRowClick = (userId: string) => {
    router.push(`/AllUser/${userId}`);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-4 text-2xl font-bold text-gray-100">
            <UserCircle2 className="w-8 h-8" />
            <span>User Management Dashboard</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search users by name, email, or country"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-black hover:bg-gray-700">
                  <TableHead className="text-white font-medium">Name</TableHead>
                  <TableHead className="text-white font-medium">phoneNumber</TableHead>
                  <TableHead className="text-white font-medium">Email</TableHead>
                  <TableHead className="text-white font-medium">Country</TableHead>
                  <TableHead className="text-white font-medium">Role</TableHead>
                  <TableHead className="text-white font-medium">Created At</TableHead>
                  <TableHead className="text-white font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-400">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-400">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow 
                      key={user._id || user.id} 
                      className="bg-gray-700 hover:bg-gray-600 transition-colors text-[#ffffff] cursor-pointer"
                      onClick={() => handleRowClick(user._id || user.id || '')}
                    >
                      <TableCell className="font-medium">
                        {user.firstName || 'N/A'} {user.lastName || 'N/A'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.phoneNumber || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {user.email || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {user.country || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-semibold
                          ${user.role === 'admin' 
                            ? 'bg-blue-500/20 text-[#22c55e]' 
                            : 'bg-green-500/20 text-green-400'
                          }
                        `}>
                          {user.role || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(user.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-800 border-gray-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-gray-100">
                                Delete User Account
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                Are you sure you want to delete {user.firstName} {user.lastName} account? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-700 text-gray-300 hover:bg-gray-600">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteUser(user._id || user.id || '')}
                                className="bg-red-500 text-white hover:bg-red-600"
                              >
                                Delete User
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}