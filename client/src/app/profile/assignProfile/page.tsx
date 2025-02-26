'use client'

import LandingLayout from '@/components/Layouts/LandingLayout'
import UserMachinesDashboard from '@/components/myAccount/assignProfile';
import DashboardLayout from '@/components/myAccount/layout';
import UserSharesDashboard from '@/components/myAccount/shareMachine';
import React from 'react'

function page() {
  return (
    <div>
      <LandingLayout>
        <DashboardLayout>
        <UserMachinesDashboard/>
        <UserSharesDashboard/>
        </DashboardLayout>
      </LandingLayout>
    </div>
  )
}

export default page;
