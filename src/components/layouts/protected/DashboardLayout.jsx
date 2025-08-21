import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkSession } from "../../../store/userSlice";

import DesktopNavDashboard from "../../ui/DesktopNavDashboard";

import MobileNavDashboard from "../../ui/MobileNavDashboard";
import { useMediaQuery } from "react-responsive";
import HeaderDashboard from "../../ui/HeaderDashboard";

import { Outlet } from "react-router";
import { Container } from "@mui/material";
import { useSidebar } from "../../../context/SidebarContext";

export default function DashboardLayout() {
  const dispatch = useDispatch();
    const { isOpen } = useSidebar();
  const { user, role } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  return (
    <div className=" p-4 h-[100vh] max-h-[100vh]  flex gap-2 max-w-[100vw]">
      {isMobile ? (
        <MobileNavDashboard role={role} />
      ) : (
        <DesktopNavDashboard role={role} />
      )}
      <div
        className="flex flex-col md:px-4 gap-4 flex-grow  min-w-0"
        style={{ width: isOpen?"calc(100% - 250px)":'100%' }}
      >
        <HeaderDashboard />
        <div className="h-full w-full overflow-y-auto pt-4 p-1">
          {" "}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
