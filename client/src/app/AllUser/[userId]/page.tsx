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
  fetchUserTransactions,
} from "@/lib/feature/userMachine/usermachineApi";
import { AppDispatch } from "@/lib/store/store";
import { useUsers } from "@/hooks/Userdetail";

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
}

const UserDetailsPage = () => {
  const { userId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState("overview");
  const {
    userMachines = [],
    userProfit = { totalProfit: 0 },
    transactions = { transactions: [], totalTransactions: 0 },
    isLoading,
  } = useSelector((state: RootState) => state.userMachine);

  const { users } = useUsers();
  const currentUser = users?.find((user) => user._id === userId) || null;
  console.log("🚀 ~ UserDetailsPage ~ currentUser:", currentUser);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserMachines(userId));
      dispatch(fetchUserTotalProfit(userId));
      dispatch(fetchUserTransactions({ userIdentifier: userId }));
    }
  }, [dispatch, userId]);

  const formatDate = (date) => {
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
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-6 text-gray-100">
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
              <span>{currentUser?.email}</span>
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
            {/* <div className="flex items-center space-x-2 rounded-lg bg-gray-700/30 p-3 text-gray-100">
              <span className="h-4 w-4 text-blue-400">Role:</span>
              <span>{currentUser?.role || "N/A"}</span>
            </div> */}
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
                  <span>Total Profit</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">
                  {formatCurrency(userProfit?.totalProfit || 0)}
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
                  {userMachines?.map((machine) => (
                    <TableRow
                      key={machine._id}
                      className="border-gray-700/50 text-gray-100 hover:bg-gray-700/50"
                    >
                      <TableCell>{machine.machine.machineName}</TableCell>
                      <TableCell>{machine.machine.model}</TableCell>
                      <TableCell>{formatDate(machine.assignedDate)}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold
                          ${
                            machine.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
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
          <Card className="border-gray-700/50 bg-gray-800/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-100">
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 bg-gray-900/50">
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Type</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions?.transactions?.map((transaction) => (
                    <TableRow
                      key={transaction._id}
                      className="border-gray-700/50 text-gray-100 hover:bg-gray-700/50"
                    >
                      <TableCell>
                        {formatDate(transaction.transactionDate)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold
                          ${
                            transaction.type === "withdrawal"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-green-400">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold
                          ${
                            transaction.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
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
