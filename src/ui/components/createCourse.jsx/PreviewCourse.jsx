import { useState } from "react";

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
  DialogContent,
  DialogActions,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../store/snackbarSlice";
import { supabase } from "../../../utils/supabase";
import AlertModal from "../../Modals/AlertModal";
import { useNavigate } from "react-router";

export default function PreviewCourse({ courseData }) {
  const [expanded, setExpanded] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [congratsModal, setCongratsModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lessonsCount = courseData?.modules?.reduce(
    (total, module) => total + (module?.lessons ? module.lessons?.length : 0),
    0
  );
  const TotalHours =
    courseData?.modules
      ?.flatMap((module) => module.lessons)
      ?.reduce((sum, lesson) => sum + (lesson?.duration_minutes || 0), 0) / 60;

  const handleAccordionChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  async function publishCourse() {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .update({
          published: true,
          edit_course_step: courseData?.edit_course_step + 1,
        })
        .eq("id", courseData?.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        dispatch(
          showSnackbar({
            message: "Your course status has been changed",
            severity: "success",
          })
        );
      }
    } catch (error) {
      dispatch(showSnackbar({ message: error.message, severity: "error" }));
    } finally {
      setIsSubmitting(false);
      setCongratsModal(true);
    }
  }
  if (!courseData) {
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
        <Typography sx={{ color: "text.primary" }}>
          {courseData?.title}
        </Typography>
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
              {courseData?.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {courseData?.description}
            </Typography>

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
              overflow: { sm: "auto" },
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
                  {courseData?.modules?.length ?? 0}
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
                overflow: { sm: "auto" },
                minHeight: 0,
                height: "100%",
              }}
            >
              {courseData?.modules?.map((module) => (
                <Accordion
                  elevation={0}
                  expanded={expanded === `panel-${module?.id}`}
                  onChange={handleAccordionChange(`panel-${module?.id}`)}
                  disableGutters
                  sx={{
                    width: "100%",

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
                            key={lesson?.id}
                            variant="outlined"
                            sx={{
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
              src={courseData.image_url}
              alt={courseData.title}
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
              ${courseData?.price?.toFixed(2)}
            </Typography>
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
                  {courseData?.modules?.length ?? 0} Sections
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
                <StarIcon fontSize="small" sx={{ color: "#ffb400" }} />
                <Typography variant="body2" color="text.secondary">
                  {courseData.rating ?? "N/A"} Rating
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Button
            onClick={publishCourse}
            disabled={isSubmitting || courseData?.published}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
            variant="contained"
            sx={{ width: "100%" }}
          >
            Publish Course
          </Button>
        </Box>
      </Box>
      {congratsModal && (
        <AlertModal
          open={congratsModal}
          setOpen={setCongratsModal}
          title={"Congrats"}
        >
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              Your course has been published successfully!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You can now view your course in the dashboard and start enrolling
              students.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: "16px 24px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
          </DialogActions>
        </AlertModal>
      )}
    </Box>
  );
}
