import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { supabase } from "../../../utils/supabase";
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
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../../../store/snackbarSlice";

export default function CourseDetails() {
  const id = useParams().slug;
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [course, setCourse] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [enrolled, setEnrolled] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const instructorName = `${course.users?.first_name ?? ""} ${course.users?.last_name ?? ""}`;
  const lessonsCount = course?.modules?.reduce(
    (total, module) => total + (module?.lessons ? module.lessons?.length : 0),
    0
  );
  const TotalHours =
    course?.modules
      ?.flatMap((module) => module.lessons)
      ?.reduce((sum, lesson) => sum + (lesson?.duration_minutes || 0), 0) / 60;

  const handleAccordionChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  async function enroll() {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .insert({ course_id: course?.id, user_id: user?.id })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        dispatch(
          showSnackbar({
            message:
              "Congratulations! You have successfully enrolled in the course.",
            severity: "success",
          })
        );
        setEnrolled(true);
        navigate(`/dashboard/course/${course?.id}/learn`);
      }
    } catch (error) {
      dispatch(showSnackbar({ message: error.message, severity: "error" }));
    }
  }
  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        setLoading(true);
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
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          data?.enrollments?.map((student) => {
            if (student?.user_id == user?.id) {
              setEnrolled(true);
            }
          });
          setCourse(data);
        }
      } catch (error) {
        dispatch(showSnackbar({ message: error.message, severity: "error" }));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, dispatch, user]);
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return <Typography>Course not found.</Typography>;
  }
  return (
    <Box
      sx={{
        padding: { xs: 0, sm: "10px" },
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Breadcrumbs aria-label="breadcrumb" sx={{ flexShrink: 0, mb: 2 }}>
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
          flexGrow: 1,
          minHeight: 0,
          height: "100%",
          overflow: { xs: "auto" },
          width: "100%",
        }}
      >
        {/* Left Pane (Main Content) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "30px",
            flexGrow: 1,
            height: { sm: "100%" },
            width: { xs: "100%", md: "auto" },
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
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {course?.title}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                wordBreak: "break-word",
                minWidth: 0,
              }}
            >
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
              height: "100%",
              overflowY: { xs: "auto" },
            }}
          >
            <Typography variant="h5"> Course Content</Typography>

            <Stack direction="row" alignItems="center" spacing={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SchoolOutlinedIcon
                  color="primary"
                  sx={{ display: { xs: "none", sm: "block" } }}
                />
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
                <OndemandVideoOutlinedIcon fontSize="small" color="primary" />
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
                <AccessTimeIcon fontSize="small" color="primary" />
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
            <Box
              sx={{
                width: "100%",
                overflowY: { xs: "auto" },
                minHeight: 0,
                height: "100%",
              }}
            >
              {course?.modules?.map((module) => (
                <Accordion
                  elevation={0}
                  expanded={expanded === `panel-${module?.id}`}
                  onChange={handleAccordionChange(`panel-${module.id}`)}
                  disableGutters
                  sx={{
                    width: "100%",
                    mb: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,

                    "&:before": { display: "none" },
                  }}
                  className="border-1 border-gray-300"
                  key={module.id}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-${module?.id}-content`}
                    id={`panel-${module.id}-header`}
                    sx={{
                      alignItems: "center",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={{ xs: 1, sm: 1.5 }}
                      sx={{ flexGrow: 1, pl: { xs: 0, sm: 2 } }}
                    >
                      <SchoolOutlinedIcon
                        color="primary"
                        sx={{ display: { xs: "none", sm: "block" } }}
                      />
                      <Typography
                        variant={{ xs: "body1", sm: "subtitle1" }}
                        fontWeight={500}
                      >
                        {module?.title}
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails
                    key={module?.id}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px 20px",
                      alignItems: "center",
                    }}
                    className="border-t-1 border-gray-200"
                  >
                    {module?.lessons.length > 0 ? (
                      <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                        {module?.lessons.map((lesson) => (
                          <Paper
                            variant="outlined"
                            key={lesson?.id}
                            sx={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              p: 1,
                              px: { xs: 1, sm: 2 }, // Responsive padding
                              backgroundColor: "background.default", // Use theme background color
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={{ xs: 1, sm: 1.5 }}
                              sx={{ flexGrow: 1 }}
                            >
                              <OndemandVideoOutlinedIcon
                                fontSize="small"
                                color="primary"
                              />
                              <Typography
                                variant={{ xs: "body2", sm: "body1" }}
                                sx={{
                                  fontWeight: 500,
                                  color: "text.primary",
                                  // Truncate text with an ellipsis if it's too long
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {lesson?.title}
                              </Typography>
                            </Stack>
                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{ display: { xs: "none", sm: "block" } }}
                            >
                              {lesson?.duration_minutes} Minutes
                            </Typography>
                          </Paper>
                        ))}
                      </Stack>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ py: 2 }}
                      >
                        No lessons in this section yet.
                      </Typography>
                    )}
                  </AccordionDetails>
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


            <Button
              onClick={
                enrolled
                  ? () => navigate(`/dashboard/course/${course?.id}/learn`)
                  : enroll
              }
              variant="contained"
              sx={{ width: "100%" }}
            >
              {enrolled ? "Go to course" : "Enroll Now"}
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
            <Stack direction="column" spacing={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SchoolOutlinedIcon color="primary" />
                <Typography variant="body2" color="text.primary">
                  {course?.modules?.length ?? 0} Sections
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <OndemandVideoOutlinedIcon fontSize="small" color="primary" />
                <Typography variant="body2" color="text.primary">
                  {lessonsCount} Lectures
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTimeIcon fontSize="small" color="primary" />
                <Typography variant="body2" color="text.primary">
                  {TotalHours.toFixed(2)} Hours
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <PeopleAltOutlinedIcon fontSize="small" color="primary" />
                <Typography variant="body2" color="text.primary">
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
