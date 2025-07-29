import React, { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import { useSelector } from "react-redux";

export default function Notification() {
  const [enrollments, setEnrollments] = useState([]);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.rpc("get_user_course_progress", {
        the_user_id: user.id,
      });

      if (error) {
        console.error(error);
      } else {
        console.log(data); // array of {course_id, total_lessons, completed_lessons, progress_percentage}
      }
    }
    fetchData();
  }, [user.id]);
  console.log("Enrollments:", enrollments);
  return <ul></ul>;
}
