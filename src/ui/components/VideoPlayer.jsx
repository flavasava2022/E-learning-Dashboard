import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../utils/supabase";
import { useSearchParams } from "react-router";
import { showSnackbar } from "../../store/snackbarSlice";
import { Box, CircularProgress } from "@mui/material";
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
  const [lesson, setLesson] = useState({});
  const [loading, setLoading] = useState(false);
  const lessonId = searchParams.get("lesson");

  async function OnVideoEnd() {
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
          console.log(data);
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
          const params = new URLSearchParams(current);
          params.set("lesson", nextLesson?.id);
          return params;
        });
        setExpanded(`panel-${nextLesson?.module_id}`);
        setLastLesson(nextLesson);
      }
    }
  }

  useEffect(() => {
    async function fetchVideo() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("lessons")

          .select()
          .eq("id", lessonId)
          .single();
        if (error) throw error;
        if (data) {
          setLesson(data);
        }
      } catch (error) {
        dispatch(showSnackbar({ message: error.message, severity: "error" }));
      }
      setLoading(false);
    }
    if (lessonId) {
      fetchVideo();
    }
  }, [lessonId, dispatch]);

  return (
    <div className="w-full h-full">
      {lessonId === "undefined" && loading ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <ReactPlayer
          key={lesson?.id}
          className="react-player"
          src={lesson?.content_url}
          width="100%"
          height="100%"
          controls={true}
          onEnded={OnVideoEnd}
          config={{
            youtube: {
              color: "white",
            },
          }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
