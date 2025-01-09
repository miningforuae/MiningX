'use client'
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AppDispatch, RootState } from "@/lib/store/store";
import {
  fetchPendingWithdrawals,
  processWithdrawalRequest,
  fetchWithdrawalStats,
} from "@/lib/feature/withdraw/withdrawalSlice";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const AdminWithdrawalDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const ITEMS_PER_PAGE = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [adminComment, setAdminComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const withdrawalState = useSelector((state: RootState) => state.withdrawal);
  const { pendingWithdrawals, stats, isLoading, error, pagination } = withdrawalState;

  useEffect(() => {
    dispatch(fetchPendingWithdrawals({ page: currentPage, limit: ITEMS_PER_PAGE }));
    dispatch(fetchWithdrawalStats());
  }, [dispatch, currentPage]);

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleProcess = async (action: 'approved' | 'rejected') => {
    if (!selectedWithdrawal) return;

    setIsProcessing(true);
    try {
      await dispatch(processWithdrawalRequest({
        transactionId: selectedWithdrawal._id,
        action,
        adminComment,
      })).unwrap();
      
      // Refresh data
      dispatch(fetchPendingWithdrawals({ page: currentPage, limit: ITEMS_PER_PAGE }));
      dispatch(fetchWithdrawalStats());
      
      setSelectedWithdrawal(null);
      setAdminComment("");
    } catch (error) {
      console.error("Error processing withdrawal:", error);
    }
    setIsProcessing(false);
  };

  const filteredWithdrawals = pendingWithdrawals.filter(withdrawal =>
    withdrawal.user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    withdrawal.amount.toString().includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-zinc-800 bg-black/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-baseline">
              <div className="text-2xl font-bold text-white">{stats?.pending.count || 0}</div>
              <div className="text-sm font-medium text-emerald-400">
                {formatAmount(stats?.pending.amount || 0)}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-black/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Approved Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-baseline">
              <div className="text-2xl font-bold text-white">{stats?.approved.count || 0}</div>
              <div className="text-sm font-medium text-emerald-400">
                {formatAmount(stats?.approved.amount || 0)}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-black/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Rejected Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.rejected.count || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-zinc-800 bg-black/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-4">
            <CardTitle className="text-xl font-bold text-white">
              Pending Withdrawal Requests
            </CardTitle>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
              <Input
                placeholder="Search by email or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
          ) : error ? (
            <Alert className="border-red-500/20 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          ) : filteredWithdrawals.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-zinc-400">
              <Clock className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">No pending withdrawals</p>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-400">User</TableHead>
                    <TableHead className="text-zinc-400">Date</TableHead>
                    <TableHead className="text-right text-zinc-400">Amount</TableHead>
                    <TableHead className="text-right text-zinc-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWithdrawals.map((withdrawal) => (
                    <TableRow
                      key={withdrawal._id}
                      className="border-zinc-800"
                    >
                      <TableCell className="font-medium">
                        {withdrawal.user.email}
                      </TableCell>
                      <TableCell>{formatDate(withdrawal.transactionDate)}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-400">
                        {formatAmount(withdrawal.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => setSelectedWithdrawal(withdrawal)}
                            variant="outline"
                            size="sm"
                            className="border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400"
                          >
                            Process
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-zinc-400">
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, pagination.totalWithdrawals)} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalWithdrawals)} of{" "}
              {pagination.totalWithdrawals} withdrawals
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="border-zinc-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === pagination.totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="border-zinc-800"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Withdrawal Dialog */}
      <Dialog open={!!selectedWithdrawal} onOpenChange={() => setSelectedWithdrawal(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>Process Withdrawal Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-400">User</label>
                <p className="font-medium">{selectedWithdrawal?.user.email}</p>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Amount</label>
                <p className="font-medium text-emerald-400">
                  {selectedWithdrawal && formatAmount(selectedWithdrawal.amount)}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm text-zinc-400">Admin Comment</label>
              <Textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder="Add a comment (optional)"
                className="mt-1 bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => handleProcess('rejected')}
              variant="destructive"
              disabled={isProcessing}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => handleProcess('approved')}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              disabled={isProcessing}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWithdrawalDashboard;