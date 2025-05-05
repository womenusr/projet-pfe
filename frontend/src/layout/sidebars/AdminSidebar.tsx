import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";

import {
  BsCalendar,
  BsClockFill,
  BsCurrencyDollar,
  BsFileBarGraph,
  BsPass,
  BsPersonBadge,
} from "react-icons/bs";
import { FaHome } from "react-icons/fa";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`text-black absolute left-0 top-0 z-9999 flex h-screen w-72.5 
        flex-col overflow-y-hidden
          duration-300 ease-linear
          dark:bg-boxdark lg:static 
          lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <h3 className="text-white text-center font-semibold text-2xl">
            Acceuil
          </h3>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        ></button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <ul className="mb-6 flex flex-col justify-between gap-12">
              <li>
                <NavLink
                  to="/"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname === "/" && "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <FaHome color="blue" size={25} /> Acceuil
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin_dashboard"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname === "/admin_dashboard" &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <BsFileBarGraph color="green" size={25} /> Tableau de board
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/users-management"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("/users-management") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <BsPersonBadge color="purple" size={25} /> Gestion des
                  utilisateurs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/stock-management"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("/stock-management") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <BsPersonBadge color="orange" size={25} /> Gestion de stock
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/users-management"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("/users_management") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <BsPersonBadge color="magenta" size={25} /> Gestion des
                  operations
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/users-management"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("/users_management") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <BsPersonBadge color="red" size={25} /> Gestion des patrols
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
