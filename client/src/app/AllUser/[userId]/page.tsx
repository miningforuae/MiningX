// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  Calendar,
  ArrowLeft,
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUsers } from "@/hooks/Userdetail";
import {
  fetchUserMachines,
  fetchUserTotalProfit,
} from "@/lib/feature/userMachine/usermachineApi";
import { AppDispatch } from "@/lib/store/store";
import { fetchUserWithdrawals } from "@/lib/feature/withdraw/withdrawalSlice";
import LandingLayout from "@/components/Layouts/LandingLayout";

const UserDetailsPage = () => {
  const { userId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const {
    userMachines = [],
    isLoading,
  } = useSelector((state: RootState) => state.userMachine);

  const { users } = useUsers();
  const currentUser = users?.find((user) => user._id === userId) || null;

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserMachines(userId));
    }
  }, [dispatch, userId]);

  const {
    withdrawals = [],
    pagination,
  } = useSelector((state: RootState) => state.withdrawal);

  useEffect(() => {
    if (currentUser?.email) {
      dispatch(
        fetchUserWithdrawals({
          email: currentUser.email,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        })
      );
    }
  }, [currentUser?.email, dispatch, currentPage]);

  const handleRefresh = () => {
    if (currentUser?.email) {
      dispatch(
        fetchUserWithdrawals({
          email: currentUser.email,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        })
      );
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      active: "bg-green-500/10 text-green-400 border border-green-500/20",
      inactive: "bg-red-500/10 text-red-400 border border-red-500/20",
      pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
      completed: "bg-green-500/10 text-green-400 border border-green-500/20",
      failed: "bg-red-500/10 text-red-400 border border-red-500/20",
      processing: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    };

    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status.toLowerCase()]}`}
      >
        {status}
      </span>
    );
  };

  const TransactionTypeIcon = ({ type }) => {
    return type.toLowerCase() === 'withdrawal' ? (
      <ArrowUpRight className="h-4 w-4 text-red-400" />
    ) : (
      <ArrowDownLeft className="h-4 w-4 text-green-400" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-6 text-gray-100">
        <div className="text-xl">Loading user details...</div>
      </div>
    );
  }

  return (
    <LandingLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 p-6 text-gray-50">
        <div className="mx-auto max-w-7xl">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-6 text-gray-300 hover:bg-gray-800/50 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* Profile Header */}
          <Card className="mb-8 border-gray-800 bg-gray-900/50 backdrop-blur-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-4">
                <h1 className="text-3xl font-bold text-white">
                  {currentUser?.firstName} {currentUser?.lastName}
                </h1>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span>{currentUser?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(currentUser?.createdAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="machines" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 rounded-lg border border-gray-800 bg-gray-900/50 p-1">
              <TabsTrigger
                value="machines"
                className="text-gray-400 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
              >
                Machines
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="text-gray-400 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
              >
                Transactions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="machines">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <span className="text-white">Assigned Machines</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800 bg-gray-950/50">
                          <TableHead className="text-gray-400">Machine</TableHead>
                          <TableHead className="text-gray-400">Date</TableHead>
                          <TableHead className="text-gray-400">Status</TableHead>
                          <TableHead className="text-gray-400">Profit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userMachines?.map((machine) => (
                          <TableRow
                            key={machine._id}
                            className="border-gray-800 text-gray-300 transition-colors hover:bg-gray-800/50"
                          >
                            <TableCell className="font-medium">
                              {machine?.machine?.machineName}
                            </TableCell>
                            <TableCell>
                              {formatDate(machine?.assignedDate)}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={machine?.status} />
                            </TableCell>
                            <TableCell className="font-medium text-green-400">
                              {formatCurrency(machine?.monthlyProfitAccumulated)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-blue-400" />
                      <span>Transaction History</span>
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={isLoading}
                      className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      {isLoading ? 'Refreshing...' : 'Refresh'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800 bg-gray-950/50">
                          <TableHead className="text-gray-400">Date & Time</TableHead>
                          <TableHead className="text-gray-400">Type</TableHead>
                          <TableHead className="text-gray-400 text-right">Amount</TableHead>
                          <TableHead className="text-gray-400">Status</TableHead>
                          <TableHead className="text-gray-400">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {withdrawals.map((transaction) => (
                          <TableRow
                            key={transaction._id}
                            className="border-gray-800 text-gray-300 transition-colors hover:bg-gray-800/40"
                          >
                            <TableCell className="font-medium">
                              {formatDateTime(transaction.transactionDate)}
                            </TableCell>
                            <TableCell>
                              <span className="flex items-center gap-2">
                                <TransactionTypeIcon type={transaction.type || 'withdrawal'} />
                                <span className="capitalize">{transaction.type || 'Withdrawal'}</span>
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              <span className={transaction.type?.toLowerCase() === 'deposit' ? 'text-green-400' : 'text-red-400'}>
                                {formatCurrency(transaction.amount)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={transaction.status} />
                            </TableCell>
                            <TableCell className="text-gray-400">
                              {transaction.description || 'Withdrawal request'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>

                  {pagination && withdrawals?.length > 0 && (
                    <div className="mt-6 flex items-center justify-between border-t border-gray-800 px-2 pt-4">
                      <div className="text-sm text-gray-400">
                        Showing {withdrawals.length} of {pagination.totalWithdrawals} transactions
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50"
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-gray-400">
                          Page {currentPage} of {pagination.totalPages}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                          disabled={currentPage === pagination.totalPages}
                          className="text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </LandingLayout>
  );
};

export default UserDetailsPage;