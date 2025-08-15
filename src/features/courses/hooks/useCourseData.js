import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../utils/supabase";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../store/snackbarSlice";

export default function useCourseData({ courseId, user }) {
  const [loading, setLoading] = useState(true);
  // Store all fetched data in one object for clarity.
  const [data, setData] = useState({});
  const [loadingIds, setLoadingIds] = useState({});
  const [enrolled, setEnrolled] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!courseId || !user?.id) return;

    async function fetchData() {
      try {
        const { data: enrolled, error } = await supabase
          .from("enrollments")
          .select()
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .single();
        if (error) throw error;
        if (enrolled) {
          setEnrolled(enrolled);
          const { data, error } = await supabase
            .from("courses")
            .select(
              `
      *,
      categories (
        name
      ), progress (*),
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
            .eq("progress.user_id", user?.id)
            .eq("progress.course_id", courseId)
            .order("position", { foreignTable: "modules" })
            .order("position", { foreignTable: "modules.lessons" })
            .order("completed_at", {
              ascending: true,
              foreignTable: "progress",
            })
            .single();
          if (error) throw error;
          if (data) {
            setData(data);
          }
        }
      } catch (error) {
        dispatch(showSnackbar({ message: error.message, severity: "error" }));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId, user?.id, dispatch]);

  // Derived data for progress, completion etc (memoized)
  const progressSet = useMemo(
    () => new Set(data?.progress?.map((row) => row.lesson_id)),
    [data?.progress]
  );
  const totalLessons = useMemo(
    () =>
      data
        ? data?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
        : 0,
    [data]
  );
  const completedPercent = useMemo(
    () => (totalLessons ? (progressSet.size / totalLessons) * 100 : 0),
    [progressSet.size, totalLessons]
  );

  const handleCheckbox = useCallback(
    async (event, lesson) => {
      const id = lesson?.id;
      const checked = event.target.checked;

      const prevProgress = data.progress || [];

      let newProgress;
      if (checked) {
        newProgress = [...prevProgress, { lesson_id: id }]; // minimal object
      } else {
        newProgress = prevProgress.filter((p) => p.lesson_id !== id);
      }
      setData((prev) => ({ ...prev, progress: newProgress }));

      setLoadingIds((ids) => ({ ...ids, [id]: true }));

      try {
        if (checked) {
          // Mark complete
          const { error } = await supabase.from("progress").insert({
            module_id: lesson.module_id,
            course_id: courseId,
            lesson_id: lesson.id,
            duration_minutes: lesson.duration_minutes,
            user_id: user.id,
          });
          if (error) throw error;
        } else {
          // Unmark
          const { error } = await supabase
            .from("progress")
            .delete()
            .eq("lesson_id", lesson.id)
            .eq("user_id", user.id);
          if (error) throw error;
        }
      } catch (error) {
        dispatch(showSnackbar({ message: error.message, severity: "error" }));
        setData((prev) => ({ ...prev, progress: prevProgress }));
      } finally {
        setLoadingIds((ids) => {
          const copy = { ...ids };
          delete copy[id];
          return copy;
        });
      }
    },
    [courseId, user?.id, data.progress, dispatch]
  );
  return {
    data,
    loading,
    progressSet,
    totalLessons,
    completedPercent,
    loadingIds,
    handleCheckbox,
    enrolled,
    setEnrolled,
    setData,
  };
}
