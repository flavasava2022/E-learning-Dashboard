import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkSession } from "../../../store/userSlice";

import DesktopNavDashboard from "../../components/DesktopNavDashboard";

import MobileNavDashboard from "../../components/MobileNavDashboard";
import { useMediaQuery } from "react-responsive";
import HeaderDashboard from "../../components/HeaderDashboard";

import { Outlet } from "react-router";
import { Container } from "@mui/material";

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  return (
    <div className=" p-4 h-[100vh]  flex gap-2 max-w-[100vw]">
      {isMobile ? (
        <MobileNavDashboard role={role} />
      ) : (
        <DesktopNavDashboard role={role} />
      )}
<div className="flex flex-col px-4 gap-4 flex-grow max-w-[100%] min-w-0">
        <HeaderDashboard />
        <div className="h-full w-full overflow-y-auto pt-4">
          {" "}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
