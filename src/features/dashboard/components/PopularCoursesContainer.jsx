import React, { useEffect, useState } from "react";
import CourseCard from "../../../../ui/layouts/components/CourseCard";
import { supabase } from "../../../utils/supabase";
import { Grid } from "@mui/material";

export default function PopularCoursesContainer() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .order(`created_at`, {
            ascending: true,
          })
          .range(0, 3); // Gets rows 0, 1, 2, and 3 (first 4 rows)

        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);
  console.log(courses);
  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {courses.length > 0 ? (
        <>
          {courses.map((course) => (
            <Grid size={{ xs: 12, md: 6 }} key={course?.id}>
              <CourseCard key={course?.id} course={course} />
            </Grid>
          ))}
        </>
      ) : (
        "no courses found"
      )}
    </Grid>
  );
}
