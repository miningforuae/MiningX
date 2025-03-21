// @ts-nocheck

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Monitor,
  Calendar,
  DollarSign,
  AlertCircle,
  Coins,
  Activity,
  Share2,
  TrendingUp,
  ArrowDown,
} from "lucide-react";
import { AppDispatch, RootState } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import {
  getUserShareDetails,
  sellSharePurchase,
  resetShareMachineState,
} from "@/lib/feature/shareMachine/shareMachineSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UserSharesDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userShares, loading, error, saleSuccess } = useSelector(
    (state: RootState) => state.shareMachine,
  );

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const [selectedShare, setSelectedShare] = useState(null);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [sharesToSell, setSharesToSell] = useState(1);
  const [sellLoading, setSellLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        return;
      }

      try {
        await dispatch(getUserShareDetails(user.id)).unwrap();
      } catch (err) {
        console.error("Error fetching shares:", err);
      }
    };

    fetchData();
  }, [dispatch, user, isAuthenticated]);

  // Effect to refresh data after successful sale
  useEffect(() => {
    if (saleSuccess) {
      toast({
        title: "Sale Successful",
        description: "Your shares have been sold successfully.",
        variant: "success",
      });

      // Refresh user share data
      if (user?.id) {
        dispatch(getUserShareDetails(user.id));
      }

      // Reset sale status
      dispatch(resetShareMachineState());

      // Close dialog
      setSellDialogOpen(false);
    }
  }, [saleSuccess, dispatch, user]);

  const handleSellClick = (share) => {
    setSelectedShare(share);
    setSharesToSell(1); // Reset to 1
    setSellDialogOpen(true);
  };

  const handleSellSubmit = async () => {
    if (
      !selectedShare ||
      sharesToSell <= 0 ||
      sharesToSell > selectedShare.numberOfShares
    ) {
      return;
    }

    setSellLoading(true);
    try {
      await dispatch(
        sellSharePurchase({
          sharePurchaseId: selectedShare.id,
          payload: { numberOfSharesToSell: sharesToSell },
        }),
      ).unwrap();

      // The success useEffect will handle toast and data refresh
    } catch (error) {
      toast({
        title: "Sale Failed",
        description:
          error.message || "Failed to sell shares. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSellLoading(false);
    }
  };

  const ShareCard = ({ share }) => {
    const totalProfit = share.profitPerShare * share.numberOfShares;
    const hasProfit = totalProfit > 0;

    return (
      <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-black transition-all duration-500 hover:border-[#21eb00] hover:shadow-lg hover:shadow-[#21eb00]/10">
        {/* Profit percentage badge */}
        {hasProfit && (
          <div className="absolute right-0 top-0 z-10 rounded-bl-lg bg-[#21eb00] px-3 py-1">
            <span className="text-sm font-bold text-black">
              {((share.profitPerShare / share.pricePerShare) * 100).toFixed(1)}%
              ROI
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-[#21eb00]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 animate-pulse rounded-full bg-[#21eb00]" />
              <span className="text-sm font-medium text-zinc-400">active</span>
            </div>

            {/* Removed circular progress indicator */}
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
            {/* Profit information card */}
            <div className="rounded-xl bg-zinc-900/50 p-4 transition-colors duration-300 group-hover:bg-zinc-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-[#21eb00]" />
                  <span className="text-zinc-400">Total Profit</span>
                </div>
                <p className="text-xl font-bold text-[#21eb00]">
                  ${totalProfit.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Monthly profit info */}
            <div className="rounded-xl bg-zinc-900/50 p-4 transition-colors duration-300 group-hover:bg-zinc-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-[#21eb00]" />
                  <span className="text-zinc-400">Monthly Profit</span>
                </div>
                <p className="text-xl font-bold text-white">
                  ${share.expectedMonthlyProfit.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Investment info */}
            <div className="rounded-xl bg-zinc-900/50 p-4 transition-colors duration-300 group-hover:bg-zinc-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-zinc-400" />
                  <span className="text-zinc-400">Investment</span>
                </div>
                <p className="text-xl font-bold text-white">
                  ${share.totalInvestment.toFixed(2)}
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
            </div>

            {/* Sell button */}
            <Button
              variant="outline"
              className="w-full border-zinc-700 bg-zinc-900 text-white hover:bg-[#21eb00] hover:text-black"
              onClick={() => handleSellClick(share)}
            >
              Sell Shares
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen space-y-8 bg-zinc-950 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-white">
            Shares Dashboard
          </h2>
          <p className="text-zinc-400">
            Monitor your mining shares performance and profit accumulation.
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
                {loading ? "Loading shares..." : "No shares purchased yet."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sell Dialog */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent className="border border-zinc-800 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle>Sell Shares</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedShare &&
                `You are about to sell shares of ${selectedShare.machineName}`}
            </DialogDescription>
          </DialogHeader>

          {selectedShare && (
            <div className="space-y-4">
              <div className="rounded-xl bg-zinc-900/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Current Shares</span>
                  <span className="font-bold">
                    {selectedShare.numberOfShares}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sharesToSell">Number of shares to sell</Label>
                <Input
                  id="sharesToSell"
                  type="number"
                  min="1"
                  max={selectedShare.numberOfShares}
                  value={sharesToSell}
                  onChange={(e) =>
                    setSharesToSell(parseInt(e.target.value) || 1)
                  }
                  className="border-zinc-700 bg-zinc-900"
                />
              </div>

              <div className="rounded-xl bg-zinc-900/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Estimated Return</span>
                  <span className="font-bold text-[#21eb00]">
                    $
                    {(
                      selectedShare.pricePerShare *
                      sharesToSell *
                      0.95
                    ).toFixed(2)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  *5% fee applied on share sales
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSellDialogOpen(false)}
              className="border-zinc-700 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSellSubmit}
              disabled={
                sellLoading ||
                !selectedShare ||
                sharesToSell <= 0 ||
                sharesToSell > selectedShare?.numberOfShares
              }
              className="bg-[#21eb00] text-black hover:bg-[#21eb00]/80"
            >
              {sellLoading ? "Processing..." : "Confirm Sale"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserSharesDashboard;
