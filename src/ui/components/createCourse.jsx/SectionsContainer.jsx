// components/SectionContainer.js (Refactored)

import { memo, useState } from "react";
import { sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Tooltip,
  Typography,
  IconButton,
  Skeleton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useLessonManager } from "../../../hooks/useLessonManager";
import LessonContainer from "./LessonContainer";
import CreateLessonModal from "../../Modals/CreateLessonModal";
import EditSectionModal from "../../Modals/EditSectionModal";
import { SortableItem } from "./SortableItem";

const SectionContainer = memo(function SectionContainer({
  id,
  item,
  isUpdating,
  expanded,
  setExpanded,
  onDeleteSection,
  onUpdateSection,
  dragAttributes,
  dragListeners,
}) {
  const {
    lessons,
    updatingLessonIds,
    handleLessonAdded,
    handleDeleteLesson,
    handleDragEnd,
    handleUpdateLesson,
  } = useLessonManager(item?.lessons);
  const [createLessonModalOpen, setCreateLessonModalOpen] = useState(false);
  const [editSectionModalOpen, setEditSectionModalOpen] = useState(false);

  const dndSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAccordionChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  if (!item) {
    return <Skeleton variant="rounded" width="100%" height={60} />;
  }
  const iconButtonSx = {
    color: "text.secondary",
    "&:hover": {
      color: "primary.main",
    },
  };
  return (
    <>
      <Accordion
        elevation={0}
        expanded={expanded === `panel-${id}`}
        onChange={handleAccordionChange(`panel-${id}`)}
        disableGutters
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          opacity: isUpdating ? 0.5 : 1,

          "&:before": { display: "none" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: "100%",
            padding: "5px",
          }}
        >
          {/* AccordionSummary is now a flex item that will grow */}

          {/* Action buttons are now SIBLINGS to AccordionSummary, not children.
              This produces valid HTML. */}
          <Tooltip
            title="Drag to reorder section"
            sx={{ display: { sm: "none", xs: "block" } }}
          >
            <IconButton
              size="small"
              {...dragAttributes}
              {...dragListeners}
              sx={{
                cursor: isUpdating ? "wait" : "grab",
                display: { sm: "none", xs: "block" },
              }}
              disabled={isUpdating}
            >
              <DragIndicatorIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              width: "100%",
              alignItems: "center",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 1, sm: 1.5 }}
              sx={{ flexGrow: 1, pl: { xs: 0, sm: 2 } }}
            >
              <Tooltip
                title="Drag to reorder section"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                <IconButton
                  size="small"
                  {...dragAttributes}
                  {...dragListeners}
                  sx={{
                    cursor: isUpdating ? "wait" : "grab",
                    display: { xs: "none", sm: "block" },
                  }}
                  disabled={isUpdating}
                >
                  <DragIndicatorIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <SchoolOutlinedIcon
                color="primary"
                sx={{ display: { xs: "none", sm: "block" } }}
              />
              <Typography
                variant={{ xs: "body1", sm: "subtitle1" }}
                fontWeight={500}
              >
                {item.title}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0} alignItems="center">
              <Tooltip title="Add New Lesson">
                <IconButton
                  size="small"
                  sx={iconButtonSx}
                  onClick={() => setCreateLessonModalOpen(true)}
                >
                  <AddCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Section">
                <IconButton
                  size="small"
                  sx={iconButtonSx}
                  onClick={() => setEditSectionModalOpen(true)}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Section">
                <IconButton
                  size="small"
                  onClick={() => onDeleteSection(id)}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "error.main" },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${id}-content`}
            id={`panel-${id}-header`}
            sx={{ width: "fit-content" }}
          ></AccordionSummary>
        </Box>

        <AccordionDetails
          sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
        >
          {lessons.length > 0 ? (
            <DndContext
              sensors={dndSensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext
                items={lessons.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <Stack spacing={1.5}>
                  {lessons.map((lesson) => (
                    <SortableItem key={lesson.id} id={lesson.id}>
                      <LessonContainer
                        lessonData={lesson}
                        isUpdating={updatingLessonIds.has(lesson.id)}
                        onDelete={handleDeleteLesson}
                        onUpdateLesson={handleUpdateLesson}
                      />
                    </SortableItem>
                  ))}
                </Stack>
              </SortableContext>
            </DndContext>
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

      {/* Modals */}
      <CreateLessonModal
        open={createLessonModalOpen}
        handleClose={() => setCreateLessonModalOpen(false)}
        moduleId={id}
        position={lessons.length + 1}
        onLessonAdded={handleLessonAdded}
      />
      <EditSectionModal
        open={editSectionModalOpen}
        handleClose={() => setEditSectionModalOpen(false)}
        section={item}
        onSectionUpdated={onUpdateSection}
      />
    </>
  );
});
export default SectionContainer;
