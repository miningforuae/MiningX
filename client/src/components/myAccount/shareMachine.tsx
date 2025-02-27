// @ts-nocheck

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Monitor,
  Calendar,
  DollarSign,
  AlertCircle,
  Coins,
  Activity,
  Clock,
  TrendingUp,
  Share2,
} from "lucide-react";
import { AppDispatch, RootState } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { getUserShareDetails } from "@/lib/feature/shareMachine/shareMachineSlice";

const UserSharesDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userShares, loading, error } = useSelector(
    (state: RootState) => state.shareMachine
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [totalProfitData, setTotalProfitData] = React.useState(null);
  const [profitLoading, setProfitLoading] = React.useState(true);
  const [error1, setError] = React.useState<string | null>(null);
  const [profitPercentages, setProfitPercentages] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Log the user object to see its structure
      console.log("User object:", user);
      
      // Check if user exists and has an _id property
      if (!user?.id ) {
        console.log("User ID is missing or user not authenticated");
        setProfitLoading(false);
        return;
      }
  
      try {
        setError(null);
        setProfitLoading(true);
        
        console.log("Fetching data for user ID:", user.id);
        // Pass user._id instead of user.email
        await dispatch(getUserShareDetails(user.id)).unwrap();
        
        setProfitLoading(false);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError(err.message || "Failed to fetch data");
        setProfitLoading(false);
      }
    };
  
    fetchData();
  }, [dispatch, user, isAuthenticated]);

  const ShareCard = ({ share }) => {
    const [profitStatus, setProfitStatus] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const calculateProgress = () => {
      // Calculate days until next update
      const nextUpdate = new Date(share.nextProfitUpdate);
      const today = new Date();
      const daysLeft = Math.max(0, Math.ceil((nextUpdate - today) / (1000 * 60 * 60 * 24)));
      const progress = ((1 - (daysLeft / 30)) * 100); // Assuming 30-day cycle
      return Math.min(100, Math.max(0, progress));
    };

    const getDaysUntilNextUpdate = () => {
      const nextUpdate = new Date(share.nextProfitUpdate);
      const today = new Date();
      return Math.max(0, Math.ceil((nextUpdate - today) / (1000 * 60 * 60 * 24)));
    };

    return (
      <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-black transition-all duration-500 hover:border-[#21eb00] hover:shadow-lg hover:shadow-[#21eb00]/10">
        <div className="absolute right-0 top-0 z-10 rounded-bl-lg bg-[#21eb00] px-3 py-1">
          {/* <span className="text-sm font-bold text-black">
            {((share.profitPerShare / share.pricePerShare) * 100).toFixed(1)}%
          </span> */}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#21eb00]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 rounded-full animate-pulse bg-[#21eb00]" />
              <span className="text-sm font-medium text-zinc-400">active</span>
            </div>

            <div className="relative h-16 w-16">
              <svg
                className="h-full w-full -rotate-90 transform"
                viewBox="0 0 36 36"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  className="fill-none stroke-zinc-800"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  className="fill-none stroke-[#21eb00] transition-all duration-700 ease-in-out"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${calculateProgress()}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold text-white">
                  {getDaysUntilNextUpdate()}
                </span>
                <span className="text-xs text-zinc-400">days</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#21eb00]">
              {share.machineName}
            </h3>
            <div className="mt-2 flex items-center space-x-2 text-sm text-zinc-400">
              <Share2 className="h-4 w-4" />
              <span>Shares: {share.numberOfShares}</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-zinc-900/50 p-4 transition-colors duration-300 group-hover:bg-zinc-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-[#21eb00]" />
                  <span className="text-zinc-400">Total Profit</span>
                </div>
                <p className="text-xl font-bold text-[#21eb00]">
                  ${(share.profitPerShare * share.numberOfShares).toFixed(2) || "0.00"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-zinc-400">
                <Calendar className="h-4 w-4" />
                <span>Purchased:</span>
                <span className="text-white">
                  {new Date(share.purchaseDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-400">
                <Clock className="h-4 w-4" />
                <span>Uptime: 99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen space-y-8 bg-zinc-950 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-white">
            Shares Dashboard
          </h2>
          <p className="text-zinc-400">
            Monitor your mining shares performance and profit accumulation in
            real-time.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {userShares && userShares.shares && userShares.shares.length > 0 ? (
            userShares.shares.map((share) => (
              <ShareCard key={share.id} share={share} />
            ))
          ) : (
            <div className="col-span-full flex min-h-[200px] items-center justify-center rounded-2xl border border-zinc-800 bg-black">
              <p className="text-zinc-400">
                {profitLoading
                  ? "Loading shares..."
                  : "No shares purchased yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSharesDashboard;