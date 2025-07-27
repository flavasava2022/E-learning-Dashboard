import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { supabase } from "../../../utils/supabase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const columns = [
  { field: "id" },
  { field: "courseName", headerName: "Course Name" },
  { field: "instructor", headerName: "Instructor" },
  { field: "progress", headerName: "Progress" },
  { field: "status", headerName: "Status" },
  { field: "enrollDate", headerName: "Enrolled At" },
  { field: "actions", headerName: "Actions" },
];

const paginationModel = { page: 0, pageSize: 5 };
export default function CoursesTable() {
  const user = useSelector((state) => state.auth.user);
  const [tableData, setTableData] = useState([]);
  console.log(tableData);
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
        console.log(data);
        if (error) throw error;
        if (data) {
          const rows = data.map((course) => ({
            id: course.id,
            courseName: course.course?.name || "-", // Fix field names as per your schema
            instructor: course.course?.instructor || "-",
            progress: course.course?.progress || "-",
            status: course.completed_status,
            enrollDate: course.enrolled_at,
            actions: <div>Action Here</div>,
          }));
          setTableData(rows);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);
  return (
    <div className="max-w-[90%]">
      <DataGrid
        rows={tableData}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
    </div>
  );
}
