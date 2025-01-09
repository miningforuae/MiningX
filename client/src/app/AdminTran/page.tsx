import AdminWithdrawaAll from '@/components/AllProduct/AdminTran';
import AdminTransactionsPage from '@/components/AllProduct/AllTransaction'
import LandingLayout from '@/components/Layouts/LandingLayout'
import React from 'react'

function page() {
  return (
    <div>
      <LandingLayout>
        <AdminWithdrawaAll/>
      </LandingLayout>
    </div>
  )
}

export default page;
