import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router";
import { supabase } from "../../utils/supabase";
import { showSnackbar } from "../../store/snackbarSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { findLessonById, getNextLesson } from "../../utils/learn";
import VideoPlayer from "../../ui/components/VideoPlayer";

export default function CoursePage() {
  const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState({});
  const [course, setCourse] = useState(null);
  const [lastLesson, setLastLesson] = useState([]);
  const [progressCheckboxes, setProgressCheckboxes] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { courseId } = useParams();
  const isInitialLoad = useRef(true);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const handleAccordionChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const handleChange = async (event, lesson) => {
    const id = event.target.id;

    setLoadingIds((prev) => ({ ...prev, [id]: true }));
    if (event.target.checked) {
      try {
        const { data, error } = await supabase
          .from("progress")
          .insert({
            module_id: lesson?.module_id,
            course_id: courseId,
            lesson_id: id,
            duration_minutes: lesson?.duration_minutes,
            user_id: user?.id,
          })
          .select()
          .single();
        if (error) throw error;
        if (data) {
          setProgressCheckboxes((pervState) => ({ ...pervState, [id]: true }));
        }
      } catch (error) {
        dispatch(showSnackbar({ message: error.message, severity: "error" }));
      }
    } else {
      try {
        const { data, error } = await supabase
          .from("progress")
          .delete()
          .eq("lesson_id", id)
          .select()
          .single();
        if (error) throw error;
        if (data) {
          setProgressCheckboxes((pervState) => {
            const { [id]: removed, ...newProgress } = pervState;
            return newProgress;
          });
        }
      } catch (error) {
        dispatch(showSnackbar({ message: error.message, severity: "error" }));
      }
    }

    setLoadingIds((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  useEffect(() => {
    if (!courseId) return;
    async function fetchData() {
      try {
        setLoading(true);
        const { data: courseData, error } = await supabase
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
          )
        `
          )
          .eq("id", courseId)
          .order("position", { foreignTable: "modules" })
          .order("position", { foreignTable: "modules.lessons" })
          .single();

        if (error) throw error;

        if (courseData) {
          setCourse(courseData);
        }

        const { data: progressData, error: progressError } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .order("completed_at", { ascending: true });
        if (progressError) throw progressError;

        const progressMap =
          progressData?.reduce(
            (acc, curr) => ({
              ...acc,
              [curr.lesson_id]: true,
            }),
            {}
          ) || {};

        if (progressData) {
          setProgressCheckboxes(progressMap);
          if (isInitialLoad.current) {
            if (searchParams.get("lesson") === null) {
              console.log("search params null");
              const lessonData = findLessonById(
                courseData,
                progressData[progressData.length - 1]?.lesson_id
              );
              const nextLesson = getNextLesson(courseData, lessonData);
              console.log(nextLesson);
              setSearchParams((current) => {
                setLastLesson(nextLesson);
                const params = new URLSearchParams(current);
                params.set("lesson", nextLesson?.id);
                return params;
              });
              setExpanded(`panel-${nextLesson?.module_id}`);
            } else {
              const lessonId = searchParams.get("lesson");
              const lessonData = findLessonById(courseData, lessonId);
              setLastLesson(lessonData);
              setExpanded(`panel-${lessonData?.module_id}`);
            }
            isInitialLoad.current = false;
          }
        }
      } catch (error) {
        dispatch(showSnackbar({ message: error.message, severity: "error" }));
      } finally {
        setLoading(false);
      }
    }
    if (courseId) {
      fetchData();
    }
  }, [courseId, dispatch, user]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        height: "100%",
        minHeight: "100%",

        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: "100%",
          overflow: "auto",
          p: 2,
        }}
        className="rounded-xl shadow p-1 bg-white w-[75%]"
      >
        {" "}
        <VideoPlayer
          courseId={courseId}
          setLastLesson={setLastLesson}
          setProgressCheckboxes={setProgressCheckboxes}
          progressCheckboxes={progressCheckboxes}
          course={course}
          lastLesson={lastLesson}
          setExpanded={setExpanded}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: "100%",
          overflow: "auto",
          p: 2,
        }}
        className="rounded-xl shadow p-1 bg-white w-[45%]"
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
                sx={{
                  flexGrow: 1,
                  pl: { xs: 0, sm: 2 },
                }}
              >
                <SchoolOutlinedIcon
                  color="primary"
                  sx={{ display: { xs: "none", sm: "block" } }}
                />
                <Typography
                  variant={{
                    xs: "body1",
                    sm: "subtitle1",
                  }}
                  sx={{
                    color:
                      expanded === `panel-${module?.id}` ? "#2d9cdb" : "black",
                  }}
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
                        border: 0,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",

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
                        <Checkbox
                          id={lesson?.id}
                          checked={!!progressCheckboxes[lesson?.id]}
                          onChange={(event) => handleChange(event, lesson)}
                          disabled={!!loadingIds[lesson?.id]}
                        />
                        <Typography
                          onClick={() => {
                            setSearchParams((current) => {
                              const params = new URLSearchParams(current);
                              params.set("lesson", lesson?.id);
                              return params;
                            });
                            if (searchParams.get("lesson") !== lesson?.id) {
                              setLastLesson(lesson);
                            }
                          }}
                          variant={{ xs: "body2", sm: "body1" }}
                          sx={{
                            fontWeight: 500,
                            // Truncate text with an ellipsis if it's too long
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            cursor: "pointer",
                            color:
                              searchParams.get("lesson") === lesson?.id
                                ? "#2d9cdb"
                                : "black",
                          }}
                        >
                          {lesson?.title}
                        </Typography>
                      </Stack>
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
  );
}
