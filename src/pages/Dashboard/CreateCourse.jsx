import { Box, Breadcrumbs, Link, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import BasicInfoForm from "../../ui/components/createCourse.jsx/BasicInfoForm";

export default function CreateCourse() {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [courseTitle, setCourseTitle] = useState('');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div
      className="w-full"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "100%",
        gap: 3,
      }}
    >
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          DASHBOARD
        </Link>
        <Link underline="hover" color="inherit" href="/dashboard/mycourses">
          My COURSES
        </Link>
<Typography sx={{ color: "text.primary" }}>
  {courseTitle || "CREATE COURSE"}
</Typography>
      </Breadcrumbs>

      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        sx={{ flexShrink: 0 }} // Prevent tabs from shrinking
      >
        <Tab label="published" />
        <Tab label="ongoing" />
      </Tabs>

      {/* 2. This wrapper will grow to fill remaining space */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          padding: "5px",
          marginTop: "10px",
        }}
      >
        {loading ? (
          <Box
            sx={{
              minHeight: 300, // Adjust as needed for your area
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <BasicInfoForm onTitleChange={setCourseTitle} />
        )}
      </div>
    </div>
  );
}
