'use client'
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Search, 
  ArrowUpDown,
  Calendar,
  User,
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store/store';
import { fetchAdminTransactions } from '@/lib/feature/userMachine/usermachineApi';

// Define interfaces for type safety
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface Transaction {
  _id: string;
  user?: User;
  amount: number;
  type: string;
  transactionDate: string;
  details?: string;
}

interface TransactionData {
  transactions: Transaction[];
  totalPages: number;
  currentPage: number;
  totalTransactions: number;
}

const AdminTransactionsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('transactionDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const { transactionData, isLoading, error } = useSelector((state: RootState) => state.userMachine);
  const { transactions, totalPages, totalTransactions } = transactionData as unknown as TransactionData;

  useEffect(() => {
    dispatch(fetchAdminTransactions({ 
      page: currentPage, 
      limit, 
      sortBy, 
      order 
    }));
  }, [dispatch, currentPage, sortBy, order]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('desc');
    }
  };

  const filteredTransactions = transactions?.filter(transaction => 
    transaction.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-4 text-2xl font-bold text-gray-100">
            <DollarSign className="w-8 h-8" />
            <span>Transaction Management Dashboard</span>
          </CardTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Transactions</p>
                    <p className="text-2xl font-bold">{totalTransactions || 0}</p>
                  </div>
                  <ArrowUpDown className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search by user or transaction type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Select 
              value={sortBy} 
              onValueChange={(value) => handleSort(value)}
            >
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-gray-100">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="transactionDate">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-black hover:bg-gray-700">
                  <TableHead className="text-white font-medium">User</TableHead>
                  <TableHead className="text-white font-medium">Amount</TableHead>
                  <TableHead className="text-white font-medium">Type</TableHead>
                  <TableHead className="text-white font-medium">Date</TableHead>
                  <TableHead className="text-white font-medium">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-400">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-400">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow 
                      key={transaction._id} 
                      className="bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-100">
                              {transaction.user?.firstName} {transaction.user?.lastName}
                            </div>
                            <div className="text-sm text-gray-400">
                              {transaction.user?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium text-[#21e602]`}>
                          {formatAmount(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-[#21e602] bg-[#335b54] px-2 py-1 rounded-full text-xs font-semibold">
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(transaction.transactionDate)}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {transaction.details || 'No details provided'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600"
              >
                Previous
              </Button>
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`
                      ${currentPage === page 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600'
                      }
                    `}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactionsPage;