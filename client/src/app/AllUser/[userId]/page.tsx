// @ts-nocheck

'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, 
  Cpu, 
  DollarSign, 
  History,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft
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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


import { fetchUserMachines ,   fetchUserTotalProfit,
    fetchUserTransactions } from '@/lib/feature/userMachine/usermachineApi';
import { AppDispatch } from '@/lib/store/store';


    interface RootState {
        userMachine: {
          userMachines: any[];
          userProfit: {
            totalProfit: number;
          };
          transactions: {
            transactions: any[];
            totalTransactions: number;
          };
          isLoading: boolean;
        };
        users: {
          users: Array<{
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber?: string;
            country?: string;
            createdAt: string;
          }>;
        };
      }

const UserDetailsPage = () => {
  const { userId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const [activeTab, setActiveTab] = useState('overview');
const { userMachines = [], userProfit = { totalProfit: 0 }, transactions = { transactions: [], totalTransactions: 0 }, isLoading } = 
    useSelector((state: RootState) => state.userMachine);
  
  // Add null check and default value for users
  const users = useSelector((state: RootState) => state.users?.users ?? []);
  
  // Find current user with null check
  const currentUser = userId ? users.find(user => user._id === userId) : null;

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserMachines(userId));
      dispatch(fetchUserTotalProfit(userId));
      dispatch(fetchUserTransactions({ userIdentifier: userId }));
    }
  }, [dispatch, userId]);


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl">Loading user details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="mb-6 text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Users
      </Button>

      {/* User Profile Header */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-4">
            <User className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">
                {currentUser?.firstName} {currentUser?.lastName}
              </h1>
              <p className="text-sm text-gray-400">User Profile</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{currentUser?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{currentUser?.phoneNumber || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{currentUser?.country || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Joined {formatDate(currentUser?.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="machines">Machines</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4" />
                  <span>Total Machines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {userMachines?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Total Profit</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">
                  {formatCurrency(userProfit?.totalProfit || 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-4 h-4" />
                  <span>Total Transactions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {transactions?.totalTransactions || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Machines Tab */}
        <TabsContent value="machines">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Assigned Machines</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-900">
                    <TableHead>Machine Name</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userMachines?.map((machine) => (
                    <TableRow key={machine._id} className="hover:bg-gray-700">
                      <TableCell>{machine.machine.machineName}</TableCell>
                      <TableCell>{machine.machine.model}</TableCell>
                      <TableCell>{formatDate(machine.assignedDate)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${machine.status === 'active' 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                          }`}>
                          {machine.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-green-400">
                        {formatCurrency(machine.monthlyProfitAccumulated)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-900">
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions?.transactions?.map((transaction) => (
                    <TableRow key={transaction._id} className="hover:bg-gray-700">
                      <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${transaction.type === 'withdrawal'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-green-500/20 text-green-400'
                          }`}>
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-green-400">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${transaction.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                          {transaction.status}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetailsPage;