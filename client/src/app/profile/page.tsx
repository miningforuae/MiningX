
import LandingLayout from '@/components/Layouts/LandingLayout'
import AssigMachineUser from '@/components/myAccount/assignProfile'
import DashboardHero from '@/components/myAccount/Hero'
import DashboardLayout from '@/components/myAccount/layout'
import AccountDashboard from '@/components/myAccount/layout'
import React from 'react'

function page() {
  return (
    <div>
      <LandingLayout>
        <DashboardLayout>
          <DashboardHero/>
        </DashboardLayout>
      </LandingLayout>
    </div>
  )
}

export default page;
