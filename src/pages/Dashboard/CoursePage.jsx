import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import dayjs from "dayjs";
import AlertModal from "../../ui/Modals/AlertModal";
import VideoPlayer from "../../ui/components/VideoPlayer";
import { useParams, useSearchParams } from "react-router";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../utils/supabase";
import { showSnackbar } from "../../store/snackbarSlice";
import { findLessonById, getNextLesson } from "../../utils/learn";
import useCourseData from "../../hooks/useCourseData";

export default function CoursePage() {
  const { courseId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [congratsModal, setCongratsModal] = useState(false);
  const [lastLesson, setLastLesson] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const initialLoad = useRef(true);

  const {
    data,
    progressSet,
    totalLessons,
    completedPercent,
    loadingIds,
    handleCheckbox,
  } = useCourseData({ courseId, user });

  // Select lesson on first load
  useEffect(() => {
    if (!data?.modules) return;
    if (!initialLoad.current) return;

    let lesson = null;
    const paramLessonId = searchParams.get("lesson");
    if (paramLessonId) {
      lesson = findLessonById(data, paramLessonId);
    } else if (data?.progress?.length > 0) {
      const lastCompleted = data.progress[data.progress.length - 1]?.lesson_id;
      const lessonData = findLessonById(data, lastCompleted);
      lesson = getNextLesson(data, lessonData);
    } else {
      const firstModule = data?.modules[0];
      lesson = firstModule?.lessons?.[0] || null;
    }

    if (lesson) {
      setSearchParams((params) => {
        const copy = new URLSearchParams(params);
        copy.set("lesson", lesson.id);
        return copy;
      });
      setExpanded(`panel-${lesson.module_id}`);
      setLastLesson(lesson);
    }
    initialLoad.current = false;
  }, [data, searchParams, setSearchParams]);

  // Show congrats modal when completed
  useEffect(() => {
    if (
      data?.enrollments?.completed_status === "ongoing" &&
      data?.progress.length === totalLessons &&
      totalLessons > 0
    ) {
      (async () => {
        try {
          await supabase
            .from("enrollments")
            .update({ completed_status: "completed" })
            .eq("user_id", user.id)
            .eq("course_id", courseId);
          setCongratsModal(true);
        } catch (error) {
          dispatch(showSnackbar({ message: error.message, severity: "error" }));
        }
      })();
    }
  }, [data, totalLessons, courseId, dispatch, user.id]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Main Video Panel */}
      <Box
        className="rounded-xl shadow bg-white"
        sx={{
          flex: { xs: "1 1 auto", md: "3 2" },
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <VideoPlayer
          courseId={courseId}
          setLastLesson={setLastLesson}
          course={data?.course}
          lastLesson={lastLesson}
          setExpanded={setExpanded}
        />
      </Box>

      {/* Sidebar */}
      <Box
        className="rounded-xl shadow bg-white"
        sx={{
          flex: { xs: "1 1 auto", md: "2 3" },
          display: "flex",
          flexDirection: "column",
          p: 2,
          overflowY: "auto",
        }}
      >
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle1" fontWeight={500}>
            {completedPercent?.toFixed(0)}% Complete
          </Typography>
          <LinearProgress
            variant="determinate"
            value={completedPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              my: 1,
              [`& .MuiLinearProgress-bar`]: {
                borderRadius: 4,
              },
            }}
          />
          <Typography variant="subtitle1" fontWeight={500}>
            Last activity:&nbsp;
            {data?.progress?.length
              ? dayjs(
                  data?.progress[data?.progress.length - 1]?.completed_at
                ).format("MMM D, YYYY")
              : "N/A"}
          </Typography>
        </Box>

        {!data?.enrollments ? (
          <Typography color="text.secondary" sx={{ p: 2 }}>
            You're not enrolled in this course.
          </Typography>
        ) : (
          (data?.modules || []).map((module) => {
            const completedInModule = module.lessons.filter((l) =>
              progressSet.has(l.id)
            ).length;

            return (
              <Accordion
                key={module.id}
                elevation={0}
                expanded={expanded === `panel-${module.id}`}
                onChange={() =>
                  setExpanded(
                    expanded === `panel-${module.id}`
                      ? null
                      : `panel-${module.id}`
                  )
                }
                disableGutters
                sx={{
                  width: "100%",
                  mb: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${module.id}-content`}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ flexGrow: 1 }}
                  >
                    <SchoolOutlinedIcon
                      color="primary"
                      sx={{ display: { xs: "none", sm: "block" } }}
                    />
                    <Typography
                      variant="subtitle1"
                      fontWeight={500}
                      sx={{
                        color:
                          expanded === `panel-${module.id}`
                            ? "primary.main"
                            : "text.primary",
                      }}
                    >
                      {module.title}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      {completedInModule}/{module.lessons.length}
                    </Typography>
                  </Stack>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "10px 12px",
                    alignItems: "center",
                  }}
                >
                  {module.lessons && module.lessons.length > 0 ? (
                    <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                      {module.lessons.map((lesson) => {
                        const isActive =
                          searchParams.get("lesson") === lesson.id;
                        return (
                          <Paper
                            key={lesson.id}
                            sx={{
                              border: 0,
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              px: 1.5,
                              py: 0.5,
                              backgroundColor: isActive
                                ? "primary.lighter"
                                : "background.default",
                              borderLeft: isActive
                                ? "4px solid #2d9cdb"
                                : "4px solid transparent",
                              transition:
                                "background-color 0.2s, border-left-color 0.2s",
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                              sx={{ flexGrow: 1 }}
                            >
                              <Checkbox
                                id={lesson.id}
                                checked={progressSet.has(lesson.id)}
                                onChange={(e) => handleCheckbox(e, lesson)}
                                disabled={
                                  data?.enrollments[0]?.completed_status ===
                                    "completed" || !!loadingIds[lesson.id]
                                }
                              />
                              <Tooltip title={lesson.title}>
                                <Typography
                                  noWrap
                                  sx={{
                                    fontWeight: 500,
                                    flex: 1,
                                    cursor: "pointer",
                                    color: isActive
                                      ? "primary.main"
                                      : "text.primary",
                                  }}
                                  variant="body2"
                                  onClick={() => {
                                    setSearchParams((params) => {
                                      const copy = new URLSearchParams(params);
                                      copy.set("lesson", lesson.id);
                                      return copy;
                                    });
                                    setLastLesson(lesson);
                                  }}
                                >
                                  {lesson.title}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          </Paper>
                        );
                      })}
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
            );
          })
        )}
      </Box>

      {/* Celebration Modal */}
      {congratsModal && (
        <AlertModal
          title={`Congrats!!`}
          open={congratsModal}
          setOpen={setCongratsModal}
        >
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              Congratulations on completing the course! Your dedication and hard
              work have paid off. Keep learning and growing!
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: "16px 24px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCongratsModal(false)}
            >
              Close
            </Button>
          </DialogActions>
        </AlertModal>
      )}
    </Box>
  );
}
