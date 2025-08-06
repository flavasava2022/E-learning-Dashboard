// hooks/useCourseModules.js (a new file)

import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { arrayMove } from "@dnd-kit/sortable";
import { supabase } from "../utils/supabase";
import { showSnackbar } from "../store/snackbarSlice";

// This hook will manage everything related to the course modules
export const useCourseModules = (courseData) => {
  const dispatch = useDispatch();
  const [modules, setModules] = useState([]);
  const [confirmedModules, setConfirmedModules] = useState([]);
  const [updatingModuleIds, setUpdatingModuleIds] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false); // More accurate than 'loading'

  // Memoize adding/removing from the Set for performance
  const addUpdatingId = useCallback((id) => {
    setUpdatingModuleIds((prev) => new Set(prev).add(id));
  }, []);

  const removeUpdatingId = useCallback((id) => {
    setUpdatingModuleIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  // Effect to initialize modules from courseData
  useEffect(() => {
    const initialModules = courseData?.modules || [];
    // Always sort by position when data is first loaded
    const sortedModules = [...initialModules].sort((a, b) => a.position - b.position);
    setModules(sortedModules);
    setConfirmedModules(sortedModules);
  }, [courseData]);

  // Handler for when a new section is added via the modal
  const handleSectionAdded = ((newModule) => {
    setModules((prev) => [...prev, newModule]);
    setConfirmedModules((prev) => [...prev, newModule]);
  });

  // Handler for deleting a section
  const handleDeleteSection = useCallback(async (id) => {
    addUpdatingId(id);
    try {
      const { error } = await supabase.from("modules").delete().eq("id", id);
      if (error) throw error;

      const newModules = modules.filter((item) => item.id !== id);
      setModules(newModules);
      setConfirmedModules(newModules);
      dispatch(showSnackbar({ message: "Section successfully deleted!", severity: "success" }));
    } catch (error) {
      dispatch(showSnackbar({ message: error.message || "Deletion failed.", severity: "error" }));
    } finally {
      removeUpdatingId(id);
    }
  }, [modules, dispatch, addUpdatingId, removeUpdatingId]);

  // Handler for drag-and-drop completion
  const handleDragEnd = useCallback(async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = modules.findIndex((item) => item.id === active.id);
    const newIndex = modules.findIndex((item) => item.id === over.id);

    // Optimistically update the UI
    const reorderedModules = arrayMove(modules, oldIndex, newIndex);
    setModules(reorderedModules);
    setIsProcessing(true);

    // Prepare batch update for Supabase
    const updatePromises = reorderedModules.map((module, index) =>
      supabase.from("modules").update({ position: index + 1 }).eq("id", module.id)
    );

    try {
      const results = await Promise.all(updatePromises);
      const hasError = results.some(result => result.error);

      if (hasError) throw new Error("Failed to update section positions.");

      setConfirmedModules(reorderedModules);
      dispatch(showSnackbar({ message: "Sections successfully reordered!", severity: "success" }));
    } catch (error) {
      // If update fails, revert the UI to the last known good state
      setModules(confirmedModules);
      dispatch(showSnackbar({ message: error.message, severity: "error" }));
    } finally {
      setIsProcessing(false);
    }
  }, [modules, confirmedModules, dispatch]);
  const handleUpdateSection = useCallback((updatedSection) => {
    const update = (SectionsList) =>
      SectionsList.map((l) => (l.id === updatedSection.id ? updatedSection : l));
    setModules((prev) => update(prev));
    setConfirmedModules((prev) => update(prev));
  }, []);
  return {
    modules,
    setModules, // Still needed for optimistic updates within child components
    confirmedModules,
    setConfirmedModules, // Still needed for optimistic updates within child components
    updatingModuleIds,
    isProcessing,
    handleSectionAdded,
    handleDeleteSection,
    handleDragEnd,
    handleUpdateSection
  };
};