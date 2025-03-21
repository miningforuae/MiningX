'use client'

import LandingLayout from '@/components/Layouts/LandingLayout'
import UserMachinesDashboard from '@/components/myAccount/assignProfile';
import DashboardLayout from '@/components/myAccount/layout';
import WithdrawalDashboard from '@/components/myAccount/withdraw';
import React from 'react'

function page() {
  return (
    <div>
      <LandingLayout>
        <DashboardLayout>
        <WithdrawalDashboard/>
        </DashboardLayout>
      </LandingLayout>
    </div>
  )
}

export default page;
