import AdminProductTable from '@/components/AllProduct/ProductTable'
import UserMachineList from '@/components/Assign/MachineCatalog';
import UserMachineDashboard from '@/components/Assign/machineList';
import UserMachineProfitUpdate from '@/components/Assign/Profile';
import UserMachineAssignment from '@/components/Assign/UserMachineAssign';

import LandingLayout from '@/components/Layouts/LandingLayout'
import React from 'react'

function page() {
  return (
    <div>
      <LandingLayout>
        <UserMachineAssignment/>
        <UserMachineList/>
     
      </LandingLayout>
    </div>
  )
}

export default page;
