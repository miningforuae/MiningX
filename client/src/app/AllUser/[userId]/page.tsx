// @ts-nocheck

"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Cpu,
  DollarSign,
  History,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  Loader2,
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

import {
  fetchUserMachines,
  fetchUserTotalProfit,
} from "@/lib/feature/userMachine/usermachineApi";
import { AppDispatch } from "@/lib/store/store";
import { useUsers } from "@/hooks/Userdetail";
import { getUserBalance } from "@/lib/feature/userMachine/balanceSlice"; // Added import for balance fetching
import { fetchUserWithdrawals } from "@/lib/feature/withdraw/withdrawalSlice";

interface RootState {
  userMachine: {
    userMachines: any[];
    userProfit: {
      totalProfit: number;
    };
    isLoading: boolean;
  };
  transactions: {
    transactions: any[];
    totalTransactions: number;
    isLoading: boolean;
  };
  balance: {
    userBalance: {
      balances: {
        total: number;
      };
    };
    isLoading: boolean;
  };
  withdrawal: {
    withdrawals: any[];
    pendingWithdrawals: any[];
    allWithdrawals: any[];
    stats: any;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalWithdrawals: number;
    };
    isLoading: boolean;
    error: string | null;
  };
}
const UserDetailsPage = () => {
  const { userId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState("overview");
  const [dataFetched, setDataFetched] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  // Get the user machine state from Redux
  const userMachineState = useSelector((state: RootState) => state.userMachine);
  const transactionsState = useSelector(
    (state: RootState) => state.transactions,
  );
  const balanceState = useSelector((state: RootState) => state.balance);
  const withdrawalState = useSelector((state: RootState) => state.withdrawal);
  const withdrawals = withdrawalState?.withdrawals || [];
  // Destructure with fallback values to prevent errors
  const userMachines = userMachineState?.userMachines || [];
  const userProfit = userMachineState?.userProfit || { totalProfit: 0 };
  const transactions = transactionsState || {
    transactions: [],
    totalTransactions: 0,
  };
  const isLoading =
    userMachineState?.isLoading ||
    transactionsState?.isLoading ||
    balanceState?.isLoading ||
    false;
  const userBalance = balanceState?.userBalance?.balances?.total || 0;

  const { users } = useUsers();
  const currentUser = users?.find((user) => user._id === userId) || null;

  useEffect(() => {
    if (userId && currentUser?.email) {
      setLocalLoading(true);

      // Create an array of promises for all data fetching
      const fetchPromises = [
        dispatch(fetchUserMachines(userId)),
        dispatch(fetchUserTotalProfit(userId)),
        dispatch(
          fetchUserWithdrawals({
            email: currentUser.email,
            page: 1,
            limit: 10,
          }),
        ),
        dispatch(getUserBalance(userId)),
      ];

      // Wait for all promises to resolve
      Promise.all(fetchPromises)
        .then(() => {
          setDataFetched(true);
          setLocalLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLocalLoading(false);
        });
    }
  }, [dispatch, userId, currentUser]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  if (localLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-6 text-gray-100">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-blue-400" />
        <div className="text-xl">Loading user details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-gray-50">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="mb-6 text-gray-300 hover:bg-gray-800/50 hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Users
      </Button>

      {/* User Profile Header */}
      <Card className="mb-6 border-gray-700/50 bg-gray-800/90 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-4">
            <div className="rounded-full bg-blue-500/20 p-3">
              <User className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentUser?.firstName} {currentUser?.lastName}
              </h1>
              <p className="text-sm text-gray-300">User Profile</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-2 rounded-lg bg-gray-700/30 p-3 text-gray-100">
              <Mail className="h-4 w-4 text-blue-400" />
              <span>{currentUser?.email || "N/A"}</span>
            </div>
            <div className="flex items-center space-x-2 rounded-lg bg-gray-700/30 p-3 text-gray-100">
              <Phone className="h-4 w-4 text-blue-400" />
              <span>{currentUser?.phoneNumber || "N/A"}</span>
            </div>
            <div className="flex items-center space-x-2 rounded-lg bg-gray-700/30 p-3 text-gray-100">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>{currentUser?.country || "N/A"}</span>
            </div>
            <div className="flex items-center space-x-2 rounded-lg bg-gray-700/30 p-3 text-gray-100">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span>Joined {formatDate(currentUser?.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="border-gray-700 bg-gray-800/90">
          <TabsTrigger
            className="text-gray-100 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            value="overview"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            className="text-gray-100 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            value="machines"
          >
            Machines
          </TabsTrigger>
          <TabsTrigger
            className="text-gray-100 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            value="transactions"
          >
            Transactions
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="border-gray-700/50 bg-gray-800/90 shadow-lg hover:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-100">
                  <Cpu className="h-4 w-4 text-blue-400" />
                  <span>Total Machines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {userMachines?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700/50 bg-gray-800/90 shadow-lg hover:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-100">
                  <DollarSign className="h-4 w-4 text-blue-400" />
                  <span>Total Balance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">
                  {formatCurrency(userBalance || userProfit?.totalProfit || 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700/50 bg-gray-800/90 shadow-lg hover:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-100">
                  <History className="h-4 w-4 text-blue-400" />
                  <span>Total Transactions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {transactions?.totalTransactions || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Machines Tab */}
        <TabsContent value="machines">
          <Card className="border-gray-700/50 bg-gray-800/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-100">Assigned Machines</CardTitle>
            </CardHeader>
            <CardContent>
              {userMachines && userMachines.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 bg-gray-900/50">
                      <TableHead className="text-gray-300">
                        Machine Name
                      </TableHead>
                      <TableHead className="text-gray-300">Model</TableHead>
                      <TableHead className="text-gray-300">
                        Assigned Date
                      </TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">
                        Current Profit
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userMachines.map((machine) => (
                      <TableRow
                        key={machine._id}
                        className="border-gray-700/50 text-gray-100 hover:bg-gray-700/50"
                      >
                        <TableCell>
                          {machine.machine?.machineName || "N/A"}
                        </TableCell>
                        <TableCell>{machine.machine?.model || "N/A"}</TableCell>
                        <TableCell>
                          {formatDate(machine.assignedDate)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold
                            ${
                              machine.status === "active"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {machine.status || "unknown"}
                          </span>
                        </TableCell>
                        <TableCell className="text-green-400">
                          {formatCurrency(machine.monthlyProfitAccumulated)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-24 items-center justify-center text-gray-400">
                  No machines assigned to this user
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card className="border-gray-700/50 bg-gray-800/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-100">
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {withdrawals && withdrawals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 bg-gray-900/50">
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Type</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((withdrawal) => (
                      <TableRow
                        key={withdrawal._id}
                        className="border-gray-700/50 text-gray-100 hover:bg-gray-700/50"
                      >
                        <TableCell>
                          {formatDate(withdrawal.transactionDate)}
                        </TableCell>
                        <TableCell>
                          <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs font-semibold text-blue-400">
                            withdrawal
                          </span>
                        </TableCell>
                        <TableCell className="text-red-400 font-semibold">
                          -{formatCurrency(withdrawal.amount)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold
                    ${
                      withdrawal.status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : withdrawal.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                          >
                            {withdrawal.status || "pending"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-24 items-center justify-center text-gray-400">
                  No withdrawals found for this user
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetailsPage;
