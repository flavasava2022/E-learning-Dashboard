import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../../utils/supabase";
import {
  Box,
  Breadcrumbs,
  Link,
  Stack,
  Typography,
  Avatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardMedia,
  CardContent,
  CardActions,
  Card,
  Button,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";

import StarIcon from "@mui/icons-material/Star";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircularProgressWithLabel from "../../ui/components/CircularProgressWithLabel";
export default function CourseDetails() {
  const id = useParams().slug;
  const [course, setCourse] = useState({});

  const instructorName = `${course.users?.first_name ?? ""} ${course.users?.last_name ?? ""}`;
  const lessonsCount = course?.modules?.reduce(
    (total, module) => total + (module?.lessons ? module.lessons?.length : 0),
    0
  );
  const TotalHours =
    course?.modules
      ?.flatMap((module) => module.lessons)
      ?.reduce((sum, lesson) => sum + (lesson?.duration_minutes || 0), 0) / 60;

  console.log("Total Hours:", TotalHours);
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
      users (
        first_name,last_name,avatar_url),
      modules (
        *,
        lessons (
          *
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
        .eq("id", id);

      if (error) {
        console.error(error);
      } else {
        setCourse(data[0] || []); // Assuming data is an array and we want the first course
      }
    }
    fetchData();
  }, [id]);

  return (
    <Box
      sx={{
        padding: "10px",
        height: "100%",
      }}
    >
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          DASHBOARD
        </Link>
        <Link underline="hover" color="inherit" href="/dashboard/courses">
          COURSES
        </Link>
        <Typography sx={{ color: "text.primary" }}>{course?.title}</Typography>
      </Breadcrumbs>
      <Box
        sx={{
          gap: "40px",
          display: "flex",
          alignItems: { xs: "center", md: "start" },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            marginTop: "20px",
            padding: { md: "20px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "30px",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "start",
              gap: "20px",
              width: "100%",
              overflow: "auto",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {course?.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {course?.description}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={course.users?.avatar_url}
                  sx={{ borderRadius: "8px", width: 60, height: 60 }}
                  alt={instructorName}
                />
                <Typography variant="body2" sx={{ color: "#2d9cdb" }}>
                  {instructorName}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PeopleAltOutlinedIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {course.enrollments?.length ?? 0}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <StarIcon fontSize="small" sx={{ color: "#ffb400" }} />
                <Typography variant="body2" color="text.secondary">
                  {course.rating ?? "N/A"}
                </Typography>
              </Stack>
            </Stack>
            <Divider sx={{ width: "100%" }} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: { xs: "center", md: "start" },
              gap: "20px",
              width: "100%",
            }}
          >
            <Typography variant="h5"> Course Content</Typography>

            <Stack direction="row" alignItems="center" spacing={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <MenuBookIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {course?.modules?.length ?? 0}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: { xs: "none", md: "block" } }}
                  color="text.secondary"
                >
                  Sections
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LibraryBooksOutlinedIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {lessonsCount}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: { xs: "none", md: "block" } }}
                  color="text.secondary"
                >
                  Lectures
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTimeIcon fontSize="small" color="action" />
                <Typography
                  variant="body2"
                  sx={{ display: { xs: "none", md: "block" } }}
                  color="text.secondary"
                >
                  {TotalHours.toFixed(2)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: { xs: "none", md: "block" } }}
                  color="text.secondary"
                >
                  Hours
                </Typography>
              </Stack>
            </Stack>
            <Box sx={{ width: "100%" }}>
              {course?.modules?.map((module, index) => (
                <Accordion
                  sx={{
                    width: "100%",

                    borderRadius: 2,
                    boxShadow: 0,
                    "&:before": { backgroundColor: "transparent" },
                  }}
                  className="border-1 border-gray-300"
                  key={module.id}
                >
                  <AccordionSummary
                    key={module.id}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index + 1}-content`}
                    id={`panel${index + 1}-header`}
                    sx={{
                      "& .MuiAccordionSummary-content": {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor: "#f5f5f5",
                        padding: "0px 10px 0px 0px",
                      },
                    }}
                  >
                    <Typography component="span" sx={{ fontWeight: "bold" }}>
                      {module?.title}
                    </Typography>
                    <CircularProgressWithLabel
                      value={(module?.lessons.length / lessonsCount) * 100 || 0}
                    />
                  </AccordionSummary>
                  {module?.lessons.map((lesson) => (
                    <AccordionDetails
                      key={lesson.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 20px",
                      }}
                      className="border-t-1 border-gray-200"
                    >
                      <Stack
                        direction="row"
                        alignItems="space-between"
                        spacing={1}
                      >
                        <SlowMotionVideoIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="black">
                          {lesson?.title}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {lesson?.duration_minutes} Minutes
                      </Typography>
                    </AccordionDetails>
                  ))}
                </Accordion>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            width: { xs: "100%", md: 370 },
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 0,
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: "95%",
              padding: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: 0,
              gap: 2,
              borderRadius: "8px",
            }}
            className="border-1 border-gray-300"
          >
            <img
              src={course.image_url}
              alt={course.title}
              style={{
                // Conditional styling for the image
                width: "100%",
                maxWidth: "100%",
                height: 220,
                objectFit: "cover",
                flexShrink: 0, // Prevent image from shrinking in flex row
                borderRadius: "10px",
              }}
            />

            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              ${course?.price?.toFixed(2)}
            </Typography>

            <Button variant="contained" sx={{ width: "100%" }}>
              Buy Course Now
            </Button>
          </Box>

          <Box
            sx={{
              width: "95%",
              padding: 2,
              display: "flex",
              flexDirection: "column",

              boxShadow: 0,
              gap: 2,
              borderRadius: "8px",
            }}
            className="border-1 border-gray-300"
          >
            <Typography gutterBottom variant="h5" component="div">
              Course Features
            </Typography>
            <Stack direction="column" sx={{ padding: "0px 10px" }} spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <MenuBookIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {course?.modules?.length ?? 0} Sections
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LibraryBooksOutlinedIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {lessonsCount} Lectures
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTimeIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {TotalHours.toFixed(2)} Hours
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <PeopleAltOutlinedIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {course.enrollments?.length ?? 0} Enrolled
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <StarIcon fontSize="small" sx={{ color: "#ffb400" }} />
                <Typography variant="body2" color="text.secondary">
                  {course.rating ?? "N/A"} Rating
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
