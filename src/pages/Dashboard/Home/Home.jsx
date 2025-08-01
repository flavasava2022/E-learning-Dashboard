import OverviewContainer from "./OverviewContainer";


import { PieChart } from "@mui/x-charts/PieChart";

import Calender from "../../../ui/components/Calender";
import { BarChart, LineChart } from "@mui/x-charts";
import Assignments from "../../../ui/components/Assignments";
import StudyStatistics from "../../../ui/components/StudyStatistics";
import EnrolledCourses from "../../../ui/components/EnrolledCourses";
import MyCoursesTable from "../../../ui/components/MyCoursesTable";
export default function Home() {
  return (
    <div className="flex justify-between w-full h-full">
      <div className="flex flex-col flex-grow  md:max-w-[75%]">
        {/* <OverviewContainer /> */}
<StudyStatistics/>
<EnrolledCourses/>
<MyCoursesTable/>
      </div>
      <div className="hidden md:flex flex-col gap-4 w-[400px] max-w-[25%]">



        <div className="">
          <h1 className="text-2xl font-semibold mb-4">My Progress</h1>
          <PieChart
            sx={{
              flexDirection: "column-reverse",
              gap: 2,
              "& .MuiChartsLegend-root": {
                flexDirection: "row",
              },
            }}
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "series A" },
                  { id: 1, value: 15, label: "series B" },
                  { id: 2, value: 20, label: "series C" },
                ],
              },
            ]}
            width={250}
            height={200}
          />
        </div>
                <Assignments />
      </div>
    </div>
  );
}
