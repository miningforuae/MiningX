// @ts-nocheck
'use client'

import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import LandingLayout from '@/components/Layouts/LandingLayout'
import UserMachinesDashboard from '@/components/myAccount/assignProfile'
import DashboardLayout from '@/components/myAccount/layout'
import UserSharesDashboard from '@/components/myAccount/shareMachine'
import { AppDispatch, RootState } from "@/lib/store/store"
import { fetchUserMachines } from "@/lib/feature/userMachine/usermachineApi"
import { getUserShareDetails } from "@/lib/feature/shareMachine/shareMachineSlice"

function Page() {
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { userMachines } = useSelector((state: RootState) => state.userMachine)
  const { userShares } = useSelector((state: RootState) => state.shareMachine)
  
  const [isLoading, setIsLoading] = useState(true)
  const [hasMachines, setHasMachines] = useState(false)
  const [hasShares, setHasShares] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !isAuthenticated) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        // Fetch both machines and shares data concurrently
        const fetchPromises = []
        
        // Use email for machines and id for shares based on your existing implementation
        if (user.email) {
          fetchPromises.push(dispatch(fetchUserMachines(user.email)).unwrap())
        }
        
        if (user.id) {
          fetchPromises.push(dispatch(getUserShareDetails(user.id)).unwrap())
        }
        
        await Promise.all(fetchPromises)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [dispatch, user, isAuthenticated])

  // Update state whenever the data changes
  useEffect(() => {
    // Check if user has active machines
    setHasMachines(
      userMachines && 
      Array.isArray(userMachines) && 
      userMachines.filter(machine => machine.status === "active").length > 0
    )
    
    // Check if user has shares
    setHasShares(
      userShares && 
      userShares.shares && 
      Array.isArray(userShares.shares) && 
      userShares.shares.length > 0
    )
  }, [userMachines, userShares])

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
                  Monitor your mining assets performance and profit accumulation in real-time.
                </p>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-zinc-800"></div>
                    <div className="mt-4 text-zinc-400">Loading your assets...</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Conditionally render the dashboards */}
                  {hasMachines || hasShares ? (
                    <>
                      {hasMachines && <UserMachinesDashboard />}
                      {hasShares && <UserSharesDashboard />}
                    </>
                  ) : (
                    <div className="col-span-full flex min-h-[300px] items-center justify-center rounded-2xl border border-zinc-800 bg-black">
                      <div className="text-center p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">No Mining Assets Found</h3>
                        <p className="text-zinc-400 max-w-md">
                          You don&apos;t currently have any active mining machines or shares.
                          Visit the marketplace to purchase your first mining asset.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </DashboardLayout>
      </LandingLayout>
    </div>
  )
}

export default Page