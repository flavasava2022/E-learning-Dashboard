
import { Outlet } from "react-router";
import SettingsHeader from "../../../features/settings/components/SettingHeader";

export default function SettingsLayout() {
  return (
    <div className="flex flex-col  p-2 h-full w-full gap-4">
      <SettingsHeader />
      <div className="flex flex-col  h-full w-full">
        {" "}
        <Outlet />
      </div>
    </div>
  );
}
