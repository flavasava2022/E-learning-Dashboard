import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../utils/supabase";
import { useSearchParams } from "react-router";
import { showSnackbar } from "../../store/snackbarSlice";
import { Box, CircularProgress, Skeleton, Typography } from "@mui/material";
import { getNextLesson } from "../../utils/learn";

const VideoPlayer = ({
  courseId,
  setLastLesson,
  setProgressCheckboxes,
  progressCheckboxes,
  course,
  lastLesson,
  setExpanded,
}) => {
  const user = useSelector((state) => state.auth.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const lessonId = searchParams.get("lesson");
  const [isPlaying, setIsPlaying] = useState(true);
  async function handleVideoEnd() {
    try {
      if (!progressCheckboxes[lesson?.id]) {
        const { data, error } = await supabase
          .from("progress")
          .insert({
            module_id: lesson?.module_id,
            course_id: courseId,
            lesson_id: lesson?.id,
            duration_minutes: lesson?.duration_minutes,
            user_id: user?.id,
          })
          .select()
          .single();
        if (error) throw error;
        if (data) {
          setProgressCheckboxes((pervState) => ({
            ...pervState,
            [lesson?.id]: true,
          }));
        }
      }
    } catch (error) {
      dispatch(showSnackbar({ message: error.message, severity: "error" }));
    } finally {
      const nextLesson = getNextLesson(course, lastLesson);
      if (searchParams.get("lesson") !== nextLesson?.id) {
        setSearchParams((current) => {
          current.set("lesson", nextLesson.id);
          return current;
        });
        setExpanded(`panel-${nextLesson?.module_id}`);
        setLastLesson(nextLesson);
      }
    }
  }

  useEffect(() => {
    async function fetchVideo() {
      setLoading(true);
      setError("");
      setLesson(null);
      // Handle case where no lesson is selected
      if (!lessonId || lessonId === "undefined") {
        setError("Please select a lesson to begin. 🚀");
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("lessons")

          .select()
          .eq("id", lessonId)
          .single();
        if (error) throw error;
        if (data) {
          setLesson(data);
        } else {
          setError("Lesson not found. It might have been moved or deleted.");
        }
      } catch (error) {
        setError("Could not load the video. Please try again later.");
        dispatch(showSnackbar({ message: error.message, severity: "error" }));
      }
      setLoading(false);
    }
    if (lessonId) {
      fetchVideo();
    }
  }, [lessonId, dispatch]);
  const PlayerPlaceholder = ({ message }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#222",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h6" color="white">
        {message}
      </Typography>
    </Box>
  );
  return (
    <div className="w-full aspect-video bg-black rounded-xl shadow-2xl overflow-hidden flex items-center justify-center">
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ bgcolor: "grey.900" }}
        />
      ) : error ? (
        <PlayerPlaceholder message={error} />
      ) : (
        <ReactPlayer
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          className="react-player"
          src={lesson.content_url}
          width="100%"
          height="100%"
          controls={true}
          playing={isPlaying}
          onEnded={handleVideoEnd}
          config={{
            youtube: {
              playerVars: {
                showinfo: 0,
                color: "white",
                modestbranding: 1,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
