
import EnrolledCourses from "../../../components/common/EnrolledCourses";
import MyCoursesTable from "../../../components/common/MyCoursesTable";
import MyProgress from "../../../components/common/MyProgress";
import StudyStatistics from "../../../components/common/StudyStatistics";
export default function Home() {
  return (
    <div className="flex justify-between w-full h-full">
      <div className="flex flex-col flex-grow w-full  md:max-w-[75%]">
        {/* <OverviewContainer /> */}
<StudyStatistics/>
<EnrolledCourses/>
<MyCoursesTable/>
      </div>
      <div className="hidden md:flex flex-col gap-4 w-[350px] max-w-[25%]">



<MyProgress/>
                {/* <Assignments /> */}
      </div>
    </div>
  );
}
