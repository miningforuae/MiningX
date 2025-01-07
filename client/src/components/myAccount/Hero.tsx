"use client";
import React, { useEffect } from "react";
import { FileText, Heart, User } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { fetchUserMachines } from "@/lib/feature/userMachine/usermachineApi";

const DashboardHero = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { userMachines, isLoading } = useSelector(
    (state: RootState) => state.userMachine
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const fetchData = async () => {
      if (user?.email && isAuthenticated) {
        try {
          await dispatch(fetchUserMachines(user.email)).unwrap();
        } catch (error) {
          console.error("Error fetching machines:", error);
        }
      }
    };
    fetchData();
  }, [dispatch, user, isAuthenticated]);

  // Calculate metrics
  const activeMachinesCount =
    userMachines?.filter((m) => m.status === "active").length || 0;
  const totalAccumulatedProfit =
    userMachines?.reduce(
      (sum, machine) => sum + (machine.monthlyProfitAccumulated || 0),
      0
    ) || 0;

  const handleNavigation = (path: any) => {
    router.push(path);
  };

  interface DashboardCardProps {
    icon: React.ElementType;
    title: string;
    value: string;
    trend?: number;
    path?: string;
  }

  const DashboardCard: React.FC<DashboardCardProps> = ({
    icon: Icon,
    title,
    value,
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
          {trend && (
            <span
              className={`text-xs sm:text-sm ${
                trend > 0 ? "text-[#21eb00]" : "text-red-500"
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
          {value && (
            <p className="text-xl font-semibold text-white sm:text-2xl">
              {value}
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
      title: "Total Orders",
      value: activeMachinesCount.toString(),
      trend: 2,
      path: "/profile/assignProfile",
    },
    {
      icon: Heart,
      title: "Total Profit",
      value: `$${totalAccumulatedProfit?.toFixed(0)}`,
      trend: 0,
      path: "/profile/assignProfile",
    },
  ];

  return (
    <>
      <div className="mb-6 px-4 sm:mb-8 sm:px-0">
        <h2 className="mb-2 text-xl font-semibold sm:text-2xl lg:text-3xl">
          Welcome back,{" "}
          <span className="break-words text-[#21eb00]">{user?.email}</span>
        </h2>
        <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm lg:text-base">
          Track your activity and manage your account settings from your
          personalized dashboard.
        </p>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-3 px-4 sm:mb-8 sm:grid-cols-2 sm:gap-4 sm:px-0 lg:grid-cols-3 lg:gap-6">
        {dashboardCards.map((card, index) => (
          <DashboardCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            trend={card.trend}
            path={card.path}
          />
        ))}
      </div>
    </>
  );
};

export default DashboardHero;