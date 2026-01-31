import React from "react";
import { Box, IconButton } from "@mui/material";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";

/**
 * Reusable action buttons for a table row.
 * - Only renders a button if the corresponding handler is provided.
 *
 * @param {object}   props.row      - Current row data.
 * @param {function} props.onView   - Called as onView(row).
 * @param {function} props.onEdit   - Called as onEdit(row).
 * @param {function} props.onDelete - Called as onDelete(row.id).
 */
const ActionButtons = ({ row, onView, onEdit, onDelete }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {onView && (
        <IconButton
          size="small"
          onClick={() => onView(row)}
          title="View Details"
        >
          <RemoveRedEye sx={{ color: "#6B7280" }} />
        </IconButton>
      )}

      {onEdit && (
        <IconButton size="small" onClick={() => onEdit(row)} title="Edit">
          <Edit sx={{ color: "#3B82F6" }} />
        </IconButton>
      )}

      {onDelete && (
        <IconButton
          size="small"
          onClick={() => onDelete(row.id)}
          title="Delete"
        >
          <Delete sx={{ color: "#EF4444" }} />
        </IconButton>
      )}
    </Box>
  );
};

export default ActionButtons;