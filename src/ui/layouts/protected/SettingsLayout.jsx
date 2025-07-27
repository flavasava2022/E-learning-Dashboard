import React from "react";
import { Outlet } from "react-router";
import SettingsHeader from "../../components/SettingHeader";

export default function SettingsLayout() {
  return (
    <div className="flex flex-col gap-8 p-2 ">
      <SettingsHeader />
      <div className="flex flex-col gap-4 p-2 bg-gray-600 h-full w-full">
        {" "}
        <Outlet />
      </div>
    </div>
  );
}
