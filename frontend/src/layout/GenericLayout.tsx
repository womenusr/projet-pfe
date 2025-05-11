import React, { useEffect, useState, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import Header from "../components/header/Header";
import AdminSideBar from "./sidebars/AdminSidebar";
import { RootState } from "../redux/store"; // adjust path if needed
import OCSidebar from "./sidebars/OCSidebar";
import RDepSidebar from "./sidebars/RDepSidebar";
import AHSESidebar from "./sidebars/AHSESidebar";
import RHSESidebar from "./sidebars/RHSESidebar";

const GenericLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // Get role from Redux store
  const role = useSelector((state: RootState) => state.auth.user?.role);

  useEffect(() => {
    // Redirect if user is not admin
    console.log("User role:", role); // Debugging line
    if (!role) {
      navigate("/login");
    }
  }, [role, navigate]);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        {role == "admin" && (
          <AdminSideBar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}

        {role == "RHSE" && (
          <RHSESidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}

        {role == "AHSE" && (
          <AHSESidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}

        {role == "RDEP" && (
          <RDepSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}

        {role == "OC" && (
          <OCSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default GenericLayout;
