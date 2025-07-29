import React, { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import { useSelector } from "react-redux";

export default function Password() {
  const [enrollments, setEnrollments] = useState([]);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("courses")
        .select(
          `
    *,
    categories (
      name
    ),
    modules (
      id,
      lessons (
        id
      )
    ),
    enrollments (
      user_id,
      users (
        first_name,
        last_name,
        avatar_url
      )
    )
  `
        )
        .eq("id", "37ff6736-f774-4432-b09b-34165949c2dd");

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
