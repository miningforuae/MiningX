"use client";
import React, { useEffect } from "react";
import { FileText, Heart, DollarSign, BarChart3 } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { fetchUserMachines } from "@/lib/feature/userMachine/usermachineApi";
import { fetchUserWithdrawals } from "@/lib/feature/withdraw/withdrawalSlice";

const DashboardHero = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { userMachines, isLoading: machinesLoading } = useSelector(
    (state: RootState) => state.userMachine
  );
  const { withdrawals, isLoading: withdrawalsLoading } = useSelector(
    (state: RootState) => state.withdrawal
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const fetchData = async () => {
      if (user?.email && isAuthenticated) {
        try {
          await Promise.all([
            dispatch(fetchUserMachines(user.email)).unwrap(),
            dispatch(fetchUserWithdrawals({ email: user.email })).unwrap()
          ]);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [dispatch, user, isAuthenticated]);

  // Calculate metrics
  const activeMachinesCount = userMachines?.filter((m) => m.status === "active").length || 0;
  const totalAccumulatedProfit = userMachines?.reduce(
    (sum, machine) => sum + (machine.monthlyProfitAccumulated || 0),
    0
  ) || 0;
  const totalTransactions = withdrawals?.length || 0;
  const totalWithdrawn = withdrawals?.reduce(
    (sum, withdrawal) => sum + (withdrawal.status === 'approved' ? withdrawal.amount : 0),
    0
  ) || 0;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  interface DashboardCardProps {
    icon: React.ElementType;
    title: string;
    value: string;
    subtitle?: string;
    trend?: number;
    path?: string;
  }

  const DashboardCard: React.FC<DashboardCardProps> = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    path,
  }) => (
    <div
      onClick={() => path && handleNavigation(path)}
      className="group relative cursor-pointer overflow-hidden rounded-lg border border-zinc-800 bg-black p-4 transition-all duration-500 hover:border-[#21eb00] hover:shadow-lg hover:shadow-[#21eb00]/10 sm:p-5 md:rounded-2xl md:p-6"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#21eb00]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex flex-col">
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <div className="rounded-lg bg-zinc-900/50 p-2 backdrop-blur-sm sm:p-3">
            <Icon className="h-5 w-5 text-[#21eb00] sm:h-6 sm:w-6" />
          </div>
          {trend !== undefined && (
            <span
              className={`text-xs sm:text-sm ${
                trend >= 0 ? "text-[#21eb00]" : "text-red-500"
              }`}
            >
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          )}
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="text-base font-medium text-zinc-400 transition-colors duration-300 group-hover:text-white sm:text-lg">
            {title}
          </h3>
          <p className="text-xl font-semibold text-white sm:text-2xl">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-zinc-500 sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
        <div className="mt-3 flex items-center text-xs text-zinc-500 sm:mt-4 sm:text-sm">
          <span className="truncate">View details</span>
          <ChevronRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4" />
        </div>
      </div>
    </div>
  );

  const dashboardCards = [
    {
      icon: FileText,
      title: "Active Orders",
      value: activeMachinesCount.toString(),
      subtitle: "Current active machines",
      path: "/profile/assignProfile",
    },
    {
      icon: Heart,
      title: "Total Profit",
      value: `$${totalAccumulatedProfit.toFixed(0)}`,
      subtitle: "Accumulated earnings",
      path: "/profile/assignProfile",
    },
    {
      icon: DollarSign,
      title: "Total Withdrawn",
      value: `$${totalWithdrawn.toFixed(0)}`,
      subtitle: "Approved withdrawals",
      path: "/profile/withdraw",
    },
    {
      icon: BarChart3,
      title: "Transactions",
      value: totalTransactions.toString(),
      subtitle: "All-time withdrawals",
      path: "/profile/withdraw",
    }
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 px-4 sm:mb-8 sm:px-0">
        <h2 className="mb-2 text-xl font-semibold sm:text-2xl lg:text-3xl">
          Welcome back,{" "}
          <span className="break-words text-[#21eb00]">
            {user?.firstName} {user?.lastName}
          </span>
        </h2>
        <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm lg:text-base">
          Track your activity and manage your account settings from your personalized dashboard.
        </p>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-3 px-4 sm:mb-8 sm:grid-cols-2 sm:gap-4 sm:px-0 lg:grid-cols-4 lg:gap-6 ">
        {dashboardCards.map((card, index) => (
          <DashboardCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            path={card.path}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardHero;