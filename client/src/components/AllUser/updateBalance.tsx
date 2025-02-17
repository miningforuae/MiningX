// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, History, RefreshCw, Coins, Settings } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppDispatch, RootState } from '@/lib/store/store';
import { getUserBalance, updateBalance } from '@/lib/feature/userMachine/balanceSlice';

interface UserBalanceUpdateProps {
  userId: string;
  userName: string;
}

const UserBalanceUpdate: React.FC<UserBalanceUpdateProps> = ({ userId, userName }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [amount, setAmount] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [balanceType, setBalanceType] = useState<'admin' | 'mining'>('admin');

  const balanceData = useSelector((state: RootState) => state.balance.userBalance);
  const transactions = useSelector((state: RootState) => state.balance.transactions);
  const loading = useSelector((state: RootState) => state.balance.loading);

  useEffect(() => {
    if (userId) {
      dispatch(getUserBalance(userId));
    }
  }, [dispatch, userId]);

  const handleBalanceUpdate = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        userId,
        amount: Number(amount),
        type: 'profit',
        balanceType: balanceType
      };

      const result = await dispatch(updateBalance(updateData)).unwrap();
      toast.success(`${balanceType === 'admin' ? 'Admin' : 'Mining'} balance updated successfully`);
      
      dispatch(getUserBalance(userId));
      setAmount('');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update balance');
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'profit' ? 
      <Plus className="h-4 w-4 text-green-400" /> : 
      <Plus className="h-4 w-4 text-blue-400" />;
  };

  if (loading && !balanceData) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-400" />
            Balance Management
          </CardTitle>
          <CardDescription className="text-gray-400">
            <div className="space-y-1">
              <p className="flex items-center justify-between">
                <span>Total Balance:</span> 
                <span className="font-medium text-white">{formatCurrency(balanceData?.totalBalance || balanceData?.balances?.total || 0)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Admin Balance:</span> 
                <span className="font-medium text-blue-300">{formatCurrency(balanceData?.adminAdd || balanceData?.balances?.adminAdd || balanceData?.balances?.main || 0)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Mining Balance:</span> 
                <span className="font-medium text-green-300">{formatCurrency(balanceData?.miningBalance || balanceData?.balances?.miningBalance || balanceData?.balances?.mining || 0)}</span>
              </p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="admin" onValueChange={(value) => setBalanceType(value as 'admin' | 'mining')}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger value="admin" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Admin Balance
              </TabsTrigger>
              <TabsTrigger value="mining" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Coins className="h-4 w-4 mr-2" />
                Mining Balance
              </TabsTrigger>
            </TabsList>
            <TabsContent value="admin" className="mt-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Add funds to users admin balance</p>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount to add"
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="mining" className="mt-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Add mining profits to users balance</p>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter mining profit amount"
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <History className="h-4 w-4 mr-2" />
                Transaction History
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Transaction History</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Recent transactions for {userName}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {transactions && transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          {transaction.type === 'profit' ? 
                            <Plus className="h-4 w-4 text-green-400" /> : 
                            <Plus className="h-4 w-4 text-blue-400" />
                          }
                          <div>
                            <p className="text-sm font-medium text-white">
                              {transaction.type === 'profit' ? 'Balance Addition' : transaction.type}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(transaction.transactionDate).toLocaleDateString()} {new Date(transaction.transactionDate).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className={`text-xs ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">No transaction history available</p>
                  )}
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsHistoryOpen(false)}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            onClick={handleBalanceUpdate}
            disabled={isLoading || !amount}
            className={`${
              balanceType === 'admin'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Add {balanceType === 'admin' ? 'Admin' : 'Mining'} Balance
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserBalanceUpdate;