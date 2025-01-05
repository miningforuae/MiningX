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
  TrendingUp
} from "lucide-react";
import {
  fetchUserMachines,
  fetchUserTotalProfit,
} from "@/lib/feature/userMachine/usermachineApi";
import { AppDispatch, RootState } from "@/lib/store/store";
import {
  UserMachine,
  ProfitUpdateStatus,
  UserProfitSummary,
} from "@/types/userMachine";

const UserMachinesDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userMachines, isLoading, error } = useSelector(
    (state: RootState) => state.userMachine
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [totalProfitData, setTotalProfitData] = React.useState<UserProfitSummary | null>(null);
  const [profitLoading, setProfitLoading] = React.useState(true);
  const [error1, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email || !isAuthenticated) {
        setProfitLoading(false);
        return;
      }

      try {
        setError(null);
        setProfitLoading(true);
        const [machinesResult, profitResult] = await Promise.all([
          dispatch(fetchUserMachines(user.email)).unwrap(),
          dispatch(fetchUserTotalProfit(user.email)).unwrap(),
        ]);
        setTotalProfitData(profitResult);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setProfitLoading(false);
      }
    };

    fetchData();
  }, [dispatch, user, isAuthenticated]);

  const StatsOverview: React.FC<{ profitData: UserProfitSummary }> = ({ profitData }) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-black p-6 transition-all duration-300 hover:border-[#21eb00]/50">
        <div className="absolute inset-0 bg-gradient-to-br from-[#21eb00]/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-[#21eb00]/10 p-2">
              <Monitor className="h-6 w-6 text-[#21eb00]" />
            </div>
            <h3 className="text-sm font-medium text-zinc-400">Total Machines</h3>
          </div>
          <p className="mt-4 text-4xl font-bold tracking-tight text-white">
            {profitData?.totalMachines || 0}
          </p>
          <div className="mt-2 flex items-center space-x-2 text-sm">
            <Activity className="h-4 w-4 text-[#21eb00]" />
            <span className="text-zinc-400">Active Miners</span>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-black p-6 transition-all duration-300 hover:border-[#21eb00]/50">
        <div className="absolute inset-0 bg-gradient-to-br from-[#21eb00]/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-[#21eb00]/10 p-2">
              <Coins className="h-6 w-6 text-[#21eb00]" />
            </div>
            <h3 className="text-sm font-medium text-zinc-400">Total Profit</h3>
          </div>
          <p className="mt-4 text-4xl font-bold tracking-tight text-white">
            ${profitData?.totalProfit?.toFixed(0) || "0.00"}
          </p>
          <div className="mt-2 flex items-center space-x-2 text-sm">
            <TrendingUp className="h-4 w-4 text-[#21eb00]" />
            <span className="text-zinc-400">Accumulated Earnings</span>
          </div>
        </div>
      </div>
    </div>
  );

  const MachineCard: React.FC<{ machine: UserMachine }> = ({ machine }) => {
    const [profitStatus, setProfitStatus] = React.useState<ProfitUpdateStatus | null>(null);
    const [loading, setLoading] = React.useState(false);

    const calculateProgress = () => {
      if (!profitStatus) return 0;
      const daysLeft = profitStatus.daysUntilNextUpdate;
      return ((1 - daysLeft) / 1) * 100;
    };

    const getMachineIdentifier = () => {
      if (typeof machine.machine === "string") return machine.machine;
      if (machine.machine && typeof machine.machine === "object") {
        return machine.machine.machineName || machine.machine._id || "Unknown Machine";
      }
      return "Unknown Machine";
    };

    return (
      <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-black transition-all duration-500 hover:border-[#21eb00] hover:shadow-lg hover:shadow-[#21eb00]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#21eb00]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`h-3 w-3 rounded-full ${
                machine.status === "active" 
                  ? "animate-pulse bg-[#21eb00]" 
                  : "bg-red-500"
              }`} />
              <span className="text-sm font-medium text-zinc-400">
              active              </span>
            </div>
            
            {!loading && profitStatus && (
              <div className="relative h-16 w-16">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" className="fill-none stroke-zinc-800" strokeWidth="3" />
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
                    {Math.max(0, Math.floor(profitStatus?.daysUntilNextUpdate || 0))}
                  </span>
                  <span className="text-xs text-zinc-400">days</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold text-white group-hover:text-[#21eb00] transition-colors duration-300">
              {getMachineIdentifier()}
            </h3>
            <div className="mt-2 flex items-center space-x-2 text-sm text-zinc-400">
              <Monitor className="h-4 w-4" />
              <span>ID: {getMachineIdentifier()}</span>
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
                  ${machine.monthlyProfitAccumulated?.toFixed(0) || "0.00"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-zinc-400">
                <Calendar className="h-4 w-4" />
                <span>Activated:</span>
                <span className="text-white">{new Date(machine.assignedDate).toLocaleDateString()}</span>
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
    <div className="min-h-screen bg-zinc-950 p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Mining Dashboard</h2>
          <p className="text-zinc-400">
            Monitor your mining machines performance and profit accumulation in real-time.
          </p>
        </div>

        {!profitLoading && totalProfitData && (
          <StatsOverview profitData={totalProfitData} />
        )}

        {error1 && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-500">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <p>Error: {error1}</p>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {userMachines && userMachines.length > 0 ? (
            userMachines.map((machine) => (
              <MachineCard
                key={typeof machine._id === "string" 
                  ? machine._id 
                  : (typeof machine.machine === "object" && machine.machine._id) || "fallback-key"}
                machine={machine}
              />
            ))
          ) : (
            <div className="col-span-full flex min-h-[200px] items-center justify-center rounded-2xl border border-zinc-800 bg-black">
              <p className="text-zinc-400">
                {isLoading ? "Loading machines..." : "No machines assigned yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMachinesDashboard;