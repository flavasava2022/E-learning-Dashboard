import React from "react";
import { Outlet } from "react-router";
import SettingsHeader from "../../components/SettingHeader";

export default function SettingsLayout() {
  return (
    <div className="flex flex-col  p-2 h-full w-full">
      <SettingsHeader />
      <div className="flex flex-col  h-full w-full">
        {" "}
        <Outlet />
      </div>
    </div>
  );
}
