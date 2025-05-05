import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { ToastContainer } from "react-toastify";
import AdminLayout from "./layout/AdminLayout";
import WorkPermit from "./pages/workPermit/WorkPermit.jsx";
import UsersManagement from "./pages/admin/usersManagement/UsersManagement.js";
import PatrolManagement from "./pages/admin/patrolManagement/PatrolManagement.jsx";
import StockManagement from "./pages/admin/stockManagement/StockManagement.tsx";
import OperationManagement from "./pages/admin/operationManagement/OperationManagement.jsx";
import Dashboard from "./pages/admin/dashboard/Dashboard.js";
import UserProfiles from "./pages/UserProfiles.tsx";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "./components/common/Loader.tsx";
import Home from "./pages/Landing/Home";
import AddUser from "./pages/admin/usersManagement/AddUser.tsx";

import Unauthorized from "./pages/OtherPage/Unauthorized.tsx";

export default function App() {
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const [nav, setNav] = useState(false);

  const openNav = () => {
    setNav(!nav);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <>
      <ToastContainer />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}

          <Route index path="/" element={<Home />} />

          <Route
            path="/work-permit"
            element={
              <AdminLayout>
                {" "}
                <WorkPermit />{" "}
              </AdminLayout>
            }
          />

          <Route
            path="/add_user"
            element={
              <AdminLayout>
                {" "}
                <AddUser />{" "}
              </AdminLayout>
            }
          />

          <Route
            path="/operation-management"
            element={
              <AdminLayout >
                {" "}
                <OperationManagement />{" "}
              </AdminLayout>
            }
          />

          <Route
            path="/admin_dashboard"
            element={
              <AdminLayout>
                {" "}
                <Dashboard />{" "}
              </AdminLayout>
            }
          />

          <Route
            path="/stock-management"
            element={
              <AdminLayout>
                {" "}
                <StockManagement />{" "}
              </AdminLayout>
            }
          />

          <Route
            path="/patrol-management"
            element={
              <AdminLayout>
                {" "}
                <PatrolManagement />{" "}
              </AdminLayout>
            }
          />

          <Route
            path="/users-management"
            element={
              <AdminLayout>
                {" "}
                <UsersManagement />{" "}
              </AdminLayout>
            }
          />

          {/* Auth Layout */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/unauthorized" element={<Unauthorized />}></Route>
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
          <Route
            path="/profile"
            element={
              <AdminLayout>
                <UserProfiles />
              </AdminLayout>
            }
          />
        </Routes>
      </Router>
    </>
  );
}
