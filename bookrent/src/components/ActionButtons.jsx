import React from 'react';
import { Box, IconButton } from '@mui/material';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';

/**
 * A reusable component for rendering a consistent set of action icon buttons.
 * It conditionally renders each button based on the handler function provided.
 * @param {object} row - The data for the current table row.
 * @param {function} onView - Function to call when the view button is clicked.
 * @param {function} onEdit - Function to call when the edit button is clicked.
 * @param {function} onDelete - Function to call when the delete button is clicked.
 */
const ActionButtons = ({ row, onView, onEdit, onDelete }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {/* View Button: Only renders if an `onView` function is passed as a prop */}
      {onView && (
        <IconButton size="small" onClick={() => onView(row)} title="View Details">
          <RemoveRedEye sx={{ color: '#6B7280' }} />
        </IconButton>
      )}

      {/* Edit Button: Only renders if an `onEdit` function is passed as a prop */}
      {onEdit && (
        <IconButton size="small" onClick={() => onEdit(row)} title="Edit">
          <Edit sx={{ color: '#3B82F6' }} />
        </IconButton>
      )}
      
      {/* Delete Button: Only renders if an `onDelete` function is passed as a prop */}
      {onDelete && (
        <IconButton size="small" onClick={() => onDelete(row.id)} title="Delete">
          <Delete sx={{ color: '#EF4444' }} />
        </IconButton>
      )}
    </Box>
  );
};

export default ActionButtons;