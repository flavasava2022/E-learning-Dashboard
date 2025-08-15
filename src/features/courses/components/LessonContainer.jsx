// components/LessonContainer.js (Enhanced)

import { memo, useState } from "react";

// MUI Components
import { Stack, Tooltip, Typography, IconButton, Paper } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined"; // A standard icon for video lessons
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// App Components
import EditLessonModal from "../components/EditLessonModal";

const LessonContainer = memo(function LessonContainer({
  lessonData,
  isUpdating,
  onDelete,
  onUpdateLesson,

  dragAttributes,
  dragListeners,
}) {
  const [editLessonModalOpen, setEditLessonModalOpen] = useState(false);

  const iconButtonSx = {
    color: "text.secondary",
    "&:hover": { color: "primary.main" },
  };

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          px: { xs: 1, sm: 2 },
          backgroundColor: "background.default",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 1, sm: 1.5 }}
          sx={{ flexGrow: 1 }}
        >
          {/* Drag Handle */}
          <Tooltip title="Drag to reorder lesson">
            <IconButton
              size="small"
              {...dragAttributes}
              {...dragListeners}
              sx={{ cursor: isUpdating ? "wait" : "grab" }}
              disabled={isUpdating}
            >
              <DragIndicatorIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Lesson Title and Icon */}
          <OndemandVideoOutlinedIcon fontSize="small" color="primary" />
          <Typography
            variant={{ xs: "body2", sm: "body1" }}
            sx={{
              fontWeight: 500,
              color: "text.primary",

              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {lessonData?.title}
          </Typography>
        </Stack>

        {/* Action Buttons */}
        <Stack direction="row" sx={{ display: { xs: "none", sm: "flex" } }}>
          <Tooltip title="Edit Lesson">
            <IconButton
              size="small"
              sx={iconButtonSx}
              onClick={() => setEditLessonModalOpen(true)}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Lesson">
            <IconButton
              size="small"
              onClick={() => onDelete(lessonData?.id)}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "error.main" },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>

      <EditLessonModal
        open={editLessonModalOpen}
        handleClose={() => setEditLessonModalOpen(false)}
        lesson={lessonData}
        onUpdateLesson={onUpdateLesson}
      />
    </>
  );
});
export default LessonContainer;
