import AdminProductTable from "@/components/AllProduct/ProductTable";
import UserMachineList from "@/components/Assign/MachineCatalog";
import UserMachineDashboard from "@/components/Assign/machineList";
import UserMachineProfitUpdate from "@/components/Assign/Profile";
import UserMachineAssignment from "@/components/Assign/UserMachineAssign";

import LandingLayout from "@/components/Layouts/LandingLayout";
import DashboardLayout from "@/components/myAccount/layout";
import ProfilePage from "@/components/UserProfile/Profile";
import React from "react";

function page() {
  return (
    <div>
      <LandingLayout>
        <DashboardLayout>
          <ProfilePage />
        </DashboardLayout>
      </LandingLayout>
    </div>
  );
}

export default page;
