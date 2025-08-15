// hooks/useLessonManager.js (a new file)

import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { arrayMove } from "@dnd-kit/sortable";
import { supabase } from "../../../utils/supabase";
import { showSnackbar } from "../../../store/snackbarSlice";

export const useLessonManager = (initialLessons = []) => {
  const dispatch = useDispatch();
  const [lessons, setLessons] = useState([]);
  const [confirmedLessons, setConfirmedLessons] = useState([]);
  const [updatingLessonIds, setUpdatingLessonIds] = useState(new Set());

  useEffect(() => {
    const sortedLessons = [...initialLessons].sort(
      (a, b) => a.position - b.position
    );
    setLessons(sortedLessons);
    setConfirmedLessons(sortedLessons);
  }, [initialLessons]);

  const addUpdatingId = (id) =>
    setUpdatingLessonIds((prev) => new Set(prev).add(id));
  const removeUpdatingId = (id) => {
    setUpdatingLessonIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleLessonAdded = useCallback(
    (newLesson) => {
      const newLessonList = [...lessons, newLesson];
      setLessons(newLessonList);
      setConfirmedLessons(newLessonList);
    },
    [lessons]
  );

  const handleDeleteLesson = useCallback(
    async (lessonId) => {
      addUpdatingId(lessonId);
      try {
        const { error } = await supabase
          .from("lessons")
          .delete()
          .eq("id", lessonId);
        if (error) throw error;

        const newLessons = lessons.filter((l) => l.id !== lessonId);
        setLessons(newLessons);
        setConfirmedLessons(newLessons);
        dispatch(
          showSnackbar({
            message: "Lesson deleted successfully.",
            severity: "success",
          })
        );
      } catch (error) {
        dispatch(
          showSnackbar({
            message: error.message || "Deletion failed.",
            severity: "error",
          })
        );
      } finally {
        removeUpdatingId(lessonId);
      }
    },
    [lessons, dispatch]
  );

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = lessons.findIndex((l) => l.id === active.id);
      const newIndex = lessons.findIndex((l) => l.id === over.id);

      const reorderedLessons = arrayMove(lessons, oldIndex, newIndex);
      setLessons(reorderedLessons);

      const updatePromises = reorderedLessons.map((lesson, index) =>
        supabase
          .from("lessons")
          .update({ position: index + 1 })
          .eq("id", lesson.id)
      );

      try {
        const results = await Promise.all(updatePromises);
        const hasError = results.some((r) => r.error);
        if (hasError) throw new Error("Failed to reorder lessons.");

        setConfirmedLessons(reorderedLessons);
        dispatch(
          showSnackbar({ message: "Lessons reordered.", severity: "success" })
        );
      } catch (error) {
        setLessons(confirmedLessons); // Revert on error
        dispatch(showSnackbar({ message: error.message, severity: "error" }));
      }
    },
    [lessons, confirmedLessons, dispatch]
  );

  const handleUpdateLesson = useCallback((updatedLesson) => {
    const update = (lessonsList) =>
      lessonsList.map((l) => (l.id === updatedLesson.id ? updatedLesson : l));
    setLessons((prev) => update(prev));
    setConfirmedLessons((prev) => update(prev));
  }, []);
  // Return everything the component needs
  return {
    lessons,
    setLessons, // Still needed for optimistic updates in children
    setConfirmedLessons,
    updatingLessonIds,
    handleLessonAdded,
    handleDeleteLesson,
    handleDragEnd,
    handleUpdateLesson,
  };
};
