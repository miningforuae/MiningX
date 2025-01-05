import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertCircle,
  TrendingUp,
  Coins,
  Loader2,
  ArrowUpRight,
  Wallet
} from "lucide-react";
import { fetchUserTotalProfit } from "@/lib/feature/userMachine/usermachineApi";
import { AppDispatch, RootState } from "@/lib/store/store";
import WithdrawalDialog from "./withdrawForm";
import TransactionHistory from "./TransactionHistory";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserProfitSummary } from "@/types/userMachine";

interface StatsOverviewProps {
  profitData: UserProfitSummary;
  onWithdrawClick: () => void;
}

const WithdrawalDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector(
    (state: RootState) => state.userMachine
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [totalProfitData, setTotalProfitData] = useState<UserProfitSummary | null>(null);
  const [profitLoading, setProfitLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout | undefined;

    const fetchData = async () => {
      if (!user?.email || !isAuthenticated) {
        setProfitLoading(false);
        return;
      }

      try {
        if (isMounted) {
          setError(null);
          setProfitLoading(true);
        }

        const profitResult = await dispatch(fetchUserTotalProfit(user.email)).unwrap();

        if (isMounted && profitResult) {
          setTotalProfitData(profitResult);
          setIsInitialLoad(false);
          setRetryCount(0);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch data");
          if (isInitialLoad && retryCount < 3) {
            setRetryCount((prev) => prev + 1);
            retryTimeout = setTimeout(() => {
              fetchData();
            }, 2000 * Math.pow(2, retryCount));
          }
        }
      } finally {
        if (isMounted) {
          setProfitLoading(false);
        }
      }
    };

    if (isAuthenticated || retryCount > 0) {
      fetchData();
    }

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [dispatch, user?.email, isAuthenticated, retryCount]);

  const StatsOverview: React.FC<StatsOverviewProps> = ({ profitData, onWithdrawClick }) => (
    <div className="space-y-6">
      <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-black p-8 transition-all duration-300 hover:border-[#21eb00]/50">
        <div className="absolute inset-0 bg-gradient-to-br from-[#21eb00]/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-[#21eb00]/10 p-3">
              <Coins className="h-8 w-8 text-[#21eb00]" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-zinc-200">Total Profit</h3>
              <p className="text-sm text-zinc-400">Available for Withdrawal</p>
            </div>
          </div>
          <p className="mt-6 text-5xl font-bold tracking-tight text-white">
            ${profitData?.totalProfit?.toFixed(0) || "0.00"}
          </p>
          <div className="mt-4 flex items-center space-x-2 text-sm">
            <TrendingUp className="h-4 w-4 text-[#21eb00]" />
            <span className="text-zinc-400">Accumulated Earnings</span>
          </div>
        </div>
      </div>

   
    </div>
  );

  if (!isAuthenticated) {
    return (
      <Alert className="border-yellow-500/20 bg-yellow-500/10">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-500">
          Please log in to view your mining dashboard.
        </AlertDescription>
      </Alert>
    );
  }

  if (!user) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#21eb00]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Mining Dashboard</h2>
        <p className="text-base text-zinc-400">
          Monitor your mining machines performance and profit accumulation in real-time.
        </p>
      </div>

      {profitLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#21eb00]" />
        </div>
      ) : (
        <>
          {totalProfitData && (
            <>
              <StatsOverview
                profitData={totalProfitData}
                onWithdrawClick={() => setIsWithdrawDialogOpen(true)}
              />
              {isAuthenticated && (
                <WithdrawalDialog
                  availableBalance={totalProfitData.totalProfit}
                  userEmail={user.email}
                />
              )}
            </>
          )}

          {user?.email && <TransactionHistory userEmail={user.email} />}

          {error && (
            <Alert className="border-red-500/20 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default WithdrawalDashboard;