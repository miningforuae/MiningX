//@ts-nocheck

"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LandingLayout from "@/components/Layouts/LandingLayout";
import UserMachinesDashboard from "@/components/myAccount/assignProfile";
import DashboardLayout from "@/components/myAccount/layout";
import UserSharesDashboard from "@/components/myAccount/shareMachine";

function Page() {
  const { userMachines, isLoading: machinesLoading } = useSelector(
    (state) => state.userMachine,
  );

  const { userShares, loading: sharesLoading } = useSelector(
    (state) => state.shareMachine,
  );

  const hasMachines =
    userMachines &&
    userMachines.length > 0 &&
    userMachines.some((machine) => machine.status === "active");
  const hasShares =
    userShares && userShares.shares && userShares.shares.length > 0;

  return (
    <div>
      <LandingLayout>
        <DashboardLayout>
          <div className="min-h-screen space-y-8 bg-zinc-950 p-6">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8">
                <h2 className="mb-2 text-3xl font-bold text-white">
                  Mining Dashboard
                </h2>
                <p className="text-zinc-400">
                  Monitor your mining assets performance and profit accumulation
                  in real-time.
                </p>
              </div>

              {/* Combined Mining Assets Section */}
              {(hasMachines ||
                machinesLoading ||
                hasShares ||
                sharesLoading) && (
                <div className="mb-12">
                  <h3 className="mb-4 text-2xl font-bold text-white">
                    Your Mining Assets
                  </h3>

                  {/* Machines Section */}
                  {(hasMachines || machinesLoading) && (
                    <div className="mb-8">
                      <UserMachinesDashboard />
                    </div>
                  )}

                  {/* Shares Section */}
                  {(hasShares || sharesLoading) && (
                    <div>
                      <UserSharesDashboard />
                    </div>
                  )}
                </div>
              )}

              {/* If no assets at all */}
              {!machinesLoading &&
                !sharesLoading &&
                !hasMachines &&
                !hasShares && (
                  <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-zinc-800 bg-black">
                    <div className="text-center">
                      <p className="text-xl text-zinc-400">
                        You dont have any mining assets yet.
                      </p>
                      <p className="mt-2 text-zinc-500">
                        Visit the marketplace to purchase your first mining
                        machine or shares.
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </DashboardLayout>
      </LandingLayout>
    </div>
  );
}

export default Page;
