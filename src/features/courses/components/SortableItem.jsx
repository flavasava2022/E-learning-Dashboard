// components/Common/SortableItem.jsx (a new file in a common folder)

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@mui/material';

export function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // Get the dragging state
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // When dragging, lift it visually with a shadow and higher z-index
    boxShadow: isDragging ? '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' : 'none',
    zIndex: isDragging ? 100 : 'auto',
  };

  // We pass down the ref, style, and drag handlers to the child component
  return (
    <Box ref={setNodeRef} style={style}>
      {/* React.cloneElement adds props to the child without needing to change how it's called */}
      {React.cloneElement(children, {
        dragAttributes: attributes,
        dragListeners: listeners,
      })}
    </Box>
  );
}