import { useSelector } from "react-redux";
import EnrolledCourses from "../../../components/common/EnrolledCourses";
import MyCoursesTable from "../../../components/common/MyCoursesTable";
import MyProgress from "../../../components/common/MyProgress";
import StudyStatistics from "../../../components/common/StudyStatistics";
export default function Home() {
  const role = useSelector((state) => state.auth.user).role === "instructor";
  return (
    <div className="flex justify-between w-full h-full">
      <div className="flex flex-col flex-grow w-full  md:max-w-[75%]">
        {/* <OverviewContainer /> */}
        <StudyStatistics />
        <EnrolledCourses />
        {role && <MyCoursesTable />}
      </div>
      <div className="hidden md:flex flex-col gap-4 w-[350px] max-w-[25%]">
        <MyProgress />
        {/* <Assignments /> */}
      </div>
    </div>
  );
}
