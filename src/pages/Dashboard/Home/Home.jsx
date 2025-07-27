import OverviewContainer from "./OverviewContainer";

import CoursesTable from "../components/CoursesTable";
import { PieChart } from "@mui/x-charts/PieChart";

import Calender from "../../../ui/components/Calender";
import { BarChart, LineChart } from "@mui/x-charts";
import Assignments from "../../../ui/components/Assignments";
export default function Home() {
  return (
    <div className="flex  gap-4 w-full h-full">
      <div className="flex flex-col flex-grow gap-4">
        <OverviewContainer />
        <h1 className="text-2xl font-semibold mb-4 ">Study Statistics</h1>
        <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
              area: true,
            },
          ]}
          height={300}
        />
        <h1 className="text-2xl font-semibold mb-4 ">My Courses</h1>
        <CoursesTable />
      </div>
      <div className="flex flex-col gap-4 w-full max-w-[400px]">
        <div>
          <h1 className="text-2xl font-semibold mb-4">Calender</h1>
          <Calender />
        </div>
        <Assignments />

        <div>
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
      </div>
    </div>
  );
}
