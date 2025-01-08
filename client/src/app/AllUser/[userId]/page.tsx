// @ts-nocheck

"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  User, Cpu, DollarSign, History, Mail, 
  Calendar, ArrowLeft, Activity, 
  TrendingUp, Shield
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
  fetchUserTransactions,
} from "@/lib/feature/userMachine/usermachineApi";
import { AppDispatch } from "@/lib/store/store";

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
    transactionData = {
      transactions: [],
      totalTransactions: 0,
      currentPage: 1,
      totalPages: 1
    },    isLoading,
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

  const StatCard = ({ icon: Icon, title, value, trend, color = "blue" }) => (
    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-lg transition-all hover:scale-102 hover:bg-gray-800/70">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-gray-400">
          <span className="text-sm font-medium">{title}</span>
          <Icon className={`h-5 w-5 text-${color}-400`} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold text-white">{value}</div>
          {trend && (
            <div className="flex items-center text-green-400">
              <TrendingUp className="mr-1 h-4 w-4" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const StatusBadge = ({ status }) => {
    const styles = {
      active: "bg-green-500/10 text-green-400 border border-green-500/20",
      inactive: "bg-red-500/10 text-red-400 border border-red-500/20",
      withdrawal: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      deposit: "bg-green-500/10 text-green-400 border border-green-500/20"
    };
    
    return (
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
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
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white">
                  {currentUser?.firstName} {currentUser?.lastName}
                </h1>
                <div className="mt-2 flex flex-wrap justify-center gap-4 md:justify-start">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{currentUser?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Joined {formatDate(currentUser?.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-lg border border-gray-800 bg-gray-900/50 p-1">
            {["overview", "machines", "transactions"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="capitalize text-gray-400 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-3">
              <StatCard
                icon={Cpu}
                title="Total Machines"
                value={userMachines?.length || 0}
                trend="12"
              />
              <StatCard
                icon={DollarSign}
                title="Total Profit"
                value={formatCurrency(userProfit?.totalProfit || 0)}
                trend="8"
                color="green"
              />
              <StatCard
                icon={History}
                title="Total Transactions"
                value={transactionData?.totalTransactions || 0}
                trend="15"
                color="purple"
              />
            </div>
          </TabsContent>

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
                            {machine.machine.machineName}
                          </TableCell>
                          <TableCell>{formatDate(machine.assignedDate)}</TableCell>
                          <TableCell>
                            <StatusBadge status={machine.status} />
                          </TableCell>
                          <TableCell className="font-medium text-green-400">
                            {formatCurrency(machine.monthlyProfitAccumulated)}
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
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  <span className="text-white">Transaction History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800 bg-gray-950/50">
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Type</TableHead>
                        <TableHead className="text-gray-400">Amount</TableHead>
                        <TableHead className="text-gray-400">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionData.transactions?.map((transaction) => (
                        <TableRow
                          key={transaction._id}
                          className="border-gray-800 text-gray-300 transition-colors hover:bg-gray-800/50"
                        >
                          <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                          <TableCell>
                            <StatusBadge status={transaction.type} />
                          </TableCell>
                          <TableCell className="font-medium text-green-400">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>{transaction.details}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDetailsPage;
