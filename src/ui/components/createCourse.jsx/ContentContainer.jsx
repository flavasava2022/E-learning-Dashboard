// components/ContentContainer/ContentContainer.js (Further enhanced)

import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Stack,
  LinearProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import { useCourseModules } from "../../../hooks/useCourseModules";
import SectionContainer from "./SectionsContainer";
import AddSectionModal from "../../Modals/AddSectionModal";
import { SortableItem } from "./SortableItem";

export default function ContentContainer({ courseData, setValue }) {
  const [addSectionModalOpen, setAddSectionModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const {
    modules,
    isProcessing,
    handleSectionAdded,
    handleDeleteSection,
    handleDragEnd,
    handleUpdateSection,
  } = useCourseModules(courseData);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const moduleIds = useMemo(() => modules.map((m) => m.id), [modules]);
  const handleDragStart = () => setExpanded(null);

  if (!courseData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          boxSizing: "border-box",
          height: "100%",
          minHeight: "100%",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
          }}
        >
          {/* ----- HEADER (NON-SCROLLABLE) ----- */}
          <Box sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={{ xs: 1.5, sm: 2 }}
              className="py-3"
            >
              <Typography
                variant="h5"
                component="h2"
                fontWeight="bold"
                sx={{
                  borderLeft: "5px solid",
                  borderColor: "primary.main",
                  pl: 2,
                }}
              >
                Course Sections
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddSectionModalOpen(true)}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Add Section
              </Button>
            </Stack>
            {isProcessing && <LinearProgress />}
          </Box>
          <Box sx={{ flex: 1, overflowY: "auto", p: { xs: 2, sm: 3 } }}>
            {modules.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              >
                <SortableContext
                  items={moduleIds}
                  strategy={verticalListSortingStrategy}
                >
                  <Stack spacing={2}>
                    {modules.map((module) => (
                      <SortableItem key={module.id} id={module.id}>
                        <SectionContainer
                          id={module.id}
                          item={module}
                          isUpdating={isProcessing}
                          expanded={expanded}
                          setExpanded={setExpanded}
                          onDeleteSection={handleDeleteSection}
                          onUpdateSection={handleUpdateSection}
                        />
                      </SortableItem>
                    ))}
                  </Stack>
                </SortableContext>
              </DndContext>
            ) : (
              <Box
                textAlign="center"
                p={4}
                mt={4}
                border="2px dashed"
                borderColor="divider"
                borderRadius={2}
              >
                <Typography variant="h6" color="text.secondary">
                  No sections yet.
                </Typography>
                <Typography color="text.secondary">
                  Click "Add Section" to get started!
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "fit-content" },
              mt: 2,
              alignSelf: "end",
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "fit-content" },
                mt: 2,
                gap: 2,
              }}
              onClick={() => setValue((pervState) => pervState - 1)}
            >
              Back
            </Button>
            <Button
              sx={{
                width: { xs: "100%", sm: "fit-content" },
                mt: 2,
                gap: 2,
              }}
              onClick={() => setValue((pervState) => pervState + 1)}
              variant="contained"
            >
              Preview
            </Button>
          </Box>
        </Paper>
      </Box>

      <AddSectionModal
        open={addSectionModalOpen}
        handleClose={() => setAddSectionModalOpen(false)}
        courseId={courseData.id}
        position={modules.length + 1}
        onSectionAdded={handleSectionAdded}
      />
    </>
  );
}
