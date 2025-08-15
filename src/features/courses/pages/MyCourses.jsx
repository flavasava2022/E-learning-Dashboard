import { Avatar } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import MapIcon from "@mui/icons-material/Map";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InstructorCoursesTabs from "../../../components/ui/InstructorCoursesTabs";
export default function MyCourses() {
  const user = useSelector((state) => state.auth.user);
  const dateStr = user?.created_at?.split(" ")[0];

  const date = new Date(dateStr);

  // Options for formatting
  const options = { year: "numeric", month: "long" };

  // Convert to desired format
  const formattedDate = date.toLocaleDateString("en-US", options);
  return (
<div className="flex flex-col gap-8 h-full p-1">
        <div className="bg-white rounded-xl w-full md:h-[220px] h-[320px] shadow flex flex-col justify-between p-2">
      {" "}
      <div className="w-full flex h-full md:flex-nowrap flex-wrap">
        <div className="flex items-center gap-2 md:px-8 md:h-full p-3  justify-center md:w-[15%] w-full ">
          <Avatar
            sx={{ width: 120, height: 120 }}
            alt={`${user?.first_name} ${user?.last_name}`}
            src={user?.avatar_url}
          />
        </div>
        <div className=" w-full h-full flex flex-col gap-1 md:justify-center  items-center md:items-start">
          <p className="font-bold text-[1.5rem] p-2 capitalize text-primary">
            {user?.first_name} {user?.last_name}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapIcon className="text-primary" />
              <span className=" capitalize">
                {user?.city ? user?.city : "egypt"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarMonthIcon className="text-primary" />
              <span>Join {formattedDate}</span>
            </div>
          </div>
        </div>
      </div>


    </div>
          <InstructorCoursesTabs id={user?.id}/>
</div>
  );
}
