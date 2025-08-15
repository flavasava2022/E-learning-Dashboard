import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import OverviewCard from "./OverviewCard";

export default function OverviewContainer() {
  const user = useSelector((state) => state.auth.user);
  const [enrollments, setEnrollments] = useState([]);

  const allEnrollments = enrollments?.length;
  const completedEnrollments = enrollments?.reduce((acc, cur) => {
    if (cur?.completed_status === "completed") {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from("enrollments")
          .select("*")
          .eq("user_id", user?.id)
          .order(`enrolled_at`, {
            ascending: true,
          });

        if (error) throw error;
        setEnrollments(data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);
  return (
    <div className="flex-wrap md:flex-nowrap flex justify-around gap-4 bg-gray-50">
      <OverviewCard
        count={allEnrollments}
        link="/dashboard/courses"
        key={"all-courses"}
      />
      <OverviewCard
        key={"completed-courses"}
        count={completedEnrollments}
        title="Completed Courses"
        link="/dashboard/courses"
      />
      <OverviewCard
        key={"inprogress courses"}
        count={allEnrollments - completedEnrollments}
        title="In-Progress Courses"
        link="/dashboard/courses"
      />
    </div>
  );
}
