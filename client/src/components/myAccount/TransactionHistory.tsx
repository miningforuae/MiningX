// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Search,
  AlertCircle,
  ArrowDownRight,
  History
} from "lucide-react";
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
import { AppDispatch, RootState } from "@/lib/store/store";
import { fetchUserTransactions } from "@/lib/feature/userMachine/usermachineApi";

interface Transaction {
  _id: string;
  transactionDate: string;
  type: 'withdrawal' | 'deposit';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionHistoryProps {
  userEmail: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ userEmail }) => {
  const dispatch = useDispatch<AppDispatch>();
  const ITEMS_PER_PAGE = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isMobileView, setIsMobileView] = useState(false);

  const {
    transactionData: { transactions, totalPages, totalTransactions },
    isLoading,
    error
  } = useSelector((state: RootState) => state.userMachine);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchUserTransactions({
        userIdentifier: userEmail,
        page: currentPage,
        limit: ITEMS_PER_PAGE
      }));
    }
  }, [dispatch, userEmail, currentPage]);

  const getStatusColor = (status: string | undefined): string => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: isMobileView ? undefined : "2-digit",
      minute: isMobileView ? undefined : "2-digit",
    });
  };

  const formatAmount = (amount: number | undefined): string => {
    if (typeof amount !== 'number') return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const MobileTransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <span className="text-sm text-zinc-400">{formatDate(transaction.transactionDate)}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="capitalize font-medium text-emerald-100">
              {transaction.type}
            </span>
            <ArrowDownRight className="h-4 w-4 text-emerald-400" />
          </div>
        </div>
        <Badge
          className={`${getStatusColor(transaction.status)} capitalize border px-2 py-0.5 text-xs`}
        >
          completed
        </Badge>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-zinc-400">Amount</span>
        <span className={`font-bold ${
          transaction.type === "withdrawal" ? "text-[#21df03]" : "text-emerald-400"
        }`}>
          {transaction.type === "withdrawal" ? "-" : "+"}
          {formatAmount(transaction.amount)}
        </span>
      </div>
    </div>
  );

  if (!userEmail) {
    return (
      <Alert className="border-yellow-500/20 bg-yellow-500/10">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-500">
          Please provide a valid email address to view transactions.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-zinc-800 bg-black/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4 px-4 sm:px-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <History className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-white">
                Transaction History
              </CardTitle>
              <p className="mt-1 text-sm text-zinc-400">
                Track your financial activities
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full bg-zinc-900 border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500 placeholder-zinc-500"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : error ? (
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        ) : transactions.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-zinc-400">
            <div className="p-4 rounded-full bg-zinc-800/50 mb-4">
              <Clock className="h-8 w-8" />
            </div>
            <p className="text-lg font-medium">No transactions found</p>
            <p className="text-sm text-zinc-500 mt-1">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {isMobileView ? (
              // Mobile View - Card Layout
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <MobileTransactionCard key={transaction._id} transaction={transaction} />
                ))}
              </div>
            ) : (
              // Desktop View - Table Layout
              <div className="rounded-xl border border-zinc-800 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableHead className="text-zinc-400 font-medium">Date</TableHead>
                      <TableHead className="text-zinc-400 font-medium">Type</TableHead>
                      <TableHead className="text-right text-zinc-400 font-medium">Amount</TableHead>
                      <TableHead className="text-zinc-400 font-medium">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow
                        key={transaction._id}
                        className="border-zinc-800 hover:bg-zinc-800/50 transition-colors duration-200"
                      >
                        <TableCell className="text-zinc-400 font-medium">
                          {formatDate(transaction.transactionDate)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="capitalize font-medium text-emerald-100">
                              {transaction.type}
                              <ArrowDownRight className="h-4 w-4 text-emerald-400" />
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          <span
                            className={
                              transaction.type === "withdrawal"
                                ? "text-[#21df03]"
                                : "text-emerald-400"
                            }
                          >
                            {transaction.type === "withdrawal" ? "-" : "+"}
                            {formatAmount(transaction.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(
                              transaction.status
                            )} capitalize border px-3 py-1`}
                          >
                           completed
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2">
              <p className="text-xs sm:text-sm text-zinc-400 text-center sm:text-left">
                Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalTransactions)} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, totalTransactions)} of{" "}
                {totalTransactions} transactions
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="h-8 w-8 sm:h-9 sm:w-9 border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-emerald-400 transition-colors duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="h-8 w-8 sm:h-9 sm:w-9 border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-emerald-400 transition-colors duration-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;