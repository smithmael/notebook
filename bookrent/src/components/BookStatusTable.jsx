import React, { useMemo, useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const GreyBadge = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: 999,
  background: theme.palette.mode === "dark" ? "#2b2f3b" : "#f3f4f6",
  color: theme.palette.text.secondary,
  fontSize: 12,
  fontWeight: 600,
}));

const StatusDot = ({ color }) => (
  <span
    style={{
      display: "inline-block",
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: color,
      marginRight: 8,
    }}
  />
);

export default function BookStatusTable({
  title = "Live Book Status",
  rows = [],
  onRowsChange,              // required for edit/delete to persist
  pageSizeOptions = [8, 10],
  enableActions = true,      // set false if you want to hide Edit/Delete
}) {
  // toolbar state (icon-only like your UI)
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [density, setDensity] = useState("standard");
  const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: true,
    bookNo: true,
    owner: true,
    status: true,
    price: true,
    actions: enableActions,
  });

  // popovers
  const [anchorSearch, setAnchorSearch] = useState(null);
  const [anchorSort, setAnchorSort] = useState(null);
  const [anchorView, setAnchorView] = useState(null);
  const [anchorFilter, setAnchorFilter] = useState(null);

  // edit/delete dialogs
  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  // unique owners for edit select
  const ownerOptions = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => {
      if (r.owner) map.set(r.owner.id ?? r.owner.name, r.owner);
    });
    return Array.from(map.values());
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const matchQ =
        !q ||
        r.bookNo?.toLowerCase().includes(q) ||
        r.owner?.name?.toLowerCase().includes(q);
      const matchS = statusFilter === "All" || r.status === statusFilter;
      return matchQ && matchS;
    });
  }, [rows, query, statusFilter]);

  // columns
  const columns = [
    {
      field: "id",
      headerName: "No.",
      width: 80,
      valueFormatter: (p) => String(p.value).padStart(2, "0"),
    },
    {
      field: "bookNo",
      headerName: "Book no.",
      width: 120,
      renderCell: (params) => <GreyBadge>{params.value}</GreyBadge>,
    },
    {
      field: "owner",
      headerName: "Owner",
      flex: 1.2,
      minWidth: 180,
      sortable: true,
      sortComparator: (a, b) => (a?.name || "").localeCompare(b?.name || ""),
      renderCell: (params) => {
        const o = params.value || {};
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar src={o.avatar} alt="" sx={{ width: 28, height: 28 }} />
            <Typography variant="body2" color="text.secondary">
              {o.name || ""}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (params) => {
        const rented = params.value === "Rented";
        return (
          <Stack direction="row" alignItems="center">
            <StatusDot color={rented ? "#ef4444" : "#3b82f6"} />
            <Typography variant="body2" color="text.secondary">
              {params.value}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {Number(params.value || 0).toFixed(1)} Birr
        </Typography>
      ),
    },
  ];

  if (enableActions) {
    columns.push({
      field: "actions",
      headerName: "",
      width: 92,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                setEditingRow(params.row);
                setEditOpen(true);
              }}
              aria-label="Edit"
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => setConfirm({ open: true, id: params.row.id })}
              aria-label="Delete"
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    });
  }

  // handlers
  const saveEdit = (updated) => {
    if (!onRowsChange) return;
    const next = rows.map((r) => (r.id === updated.id ? updated : r));
    onRowsChange(next);
    setEditOpen(false);
  };
  const confirmDelete = () => {
    if (!onRowsChange) return;
    const next = rows.filter((r) => r.id !== confirm.id);
    onRowsChange(next);
    setConfirm({ open: false, id: null });
  };

  // sort popover fields
  const sortFields = [
    { field: "id", label: "No." },
    { field: "bookNo", label: "Book no." },
    { field: "owner", label: "Owner" },
    { field: "status", label: "Status" },
    { field: "price", label: "Price" },
  ];
  const selectedSortField = sortModel?.[0]?.field || "id";
  const selectedSortDir = sortModel?.[0]?.sort || "asc";

  return (
    <Paper elevation={1} sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography fontWeight={700}>{title}</Typography>

        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="Search">
            <IconButton onClick={(e) => setAnchorSearch(e.currentTarget)} size="small">
              <SearchOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sort">
            <IconButton onClick={(e) => setAnchorSort(e.currentTarget)} size="small">
              <SortOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton onClick={(e) => setAnchorView(e.currentTarget)} size="small">
              <ViewListOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter">
            <IconButton onClick={(e) => setAnchorFilter(e.currentTarget)} size="small">
              <TuneOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Box sx={{ height: 420, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          density={density}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(m) => setColumnVisibilityModel(m)}
          sortModel={sortModel}
          onSortModelChange={(m) => setSortModel(m)}
          pageSizeOptions={pageSizeOptions}
          initialState={{
            pagination: { paginationModel: { pageSize: pageSizeOptions[0], page: 0 } },
          }}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "background.paper" },
            "& .MuiDataGrid-cell": { alignItems: "center" },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        />
      </Box>

      {/* Search */}
      <Popover
        open={Boolean(anchorSearch)}
        anchorEl={anchorSearch}
        onClose={() => setAnchorSearch(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { p: 2, width: 300 } }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Search
        </Typography>
        <TextField
          autoFocus
          fullWidth
          size="small"
          placeholder="Book no. or Owner"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Popover>

      {/* Sort */}
      <Popover
        open={Boolean(anchorSort)}
        anchorEl={anchorSort}
        onClose={() => setAnchorSort(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { p: 2, width: 300 } }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Sort
        </Typography>
        <FormControl size="small" fullWidth sx={{ mb: 1 }}>
          <Select
            value={selectedSortField}
            onChange={(e) => setSortModel([{ field: e.target.value, sort: selectedSortDir }])}
          >
            {sortFields.map((s) => (
              <MenuItem key={s.field} value={s.field}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={selectedSortDir}
          onChange={(_, val) => val && setSortModel([{ field: selectedSortField, sort: val }])}
        >
          <ToggleButton value="asc">Asc</ToggleButton>
          <ToggleButton value="desc">Desc</ToggleButton>
        </ToggleButtonGroup>
      </Popover>

      {/* View */}
      <Popover
        open={Boolean(anchorView)}
        anchorEl={anchorView}
        onClose={() => setAnchorView(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { p: 2, width: 320 } }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          View
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Row density
        </Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={density}
          onChange={(_, val) => val && setDensity(val)}
          sx={{ my: 1 }}
        >
          <ToggleButton value="compact">Compact</ToggleButton>
          <ToggleButton value="standard">Standard</ToggleButton>
          <ToggleButton value="comfortable">Comfort</ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Columns
        </Typography>
        <FormGroup sx={{ mt: 0.5 }}>
          {["id", "bookNo", "owner", "status", "price"].map((f) => (
            <FormControlLabel
              key={f}
              control={
                <Checkbox
                  size="small"
                  checked={Boolean(columnVisibilityModel[f])}
                  onChange={(e) =>
                    setColumnVisibilityModel((m) => ({ ...m, [f]: e.target.checked }))
                  }
                />
              }
              label={{ id: "No.", bookNo: "Book no.", owner: "Owner", status: "Status", price: "Price" }[f]}
            />
          ))}
        </FormGroup>
      </Popover>

      {/* Filter */}
      <Popover
        open={Boolean(anchorFilter)}
        anchorEl={anchorFilter}
        onClose={() => setAnchorFilter(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { p: 2, width: 300 } }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Filters
        </Typography>
        <FormControl fullWidth size="small">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {["All", "Rented", "Free"].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Popover>

      {/* Edit dialog */}
      <EditRowDialog
        open={editOpen}
        initial={editingRow}
        ownerOptions={ownerOptions}
        onClose={() => setEditOpen(false)}
        onSave={saveEdit}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={confirm.open}
        title="Delete record?"
        description="This action cannot be undone."
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={confirmDelete}
      />
    </Paper>
  );
}

/* ---------- Edit dialog ---------- */
function EditRowDialog({ open, onClose, onSave, initial, ownerOptions = [] }) {
  const [v, setV] = useState(
    initial || { id: undefined, bookNo: "", owner: ownerOptions[0], status: "Free", price: 0 }
  );
  useEffect(() => {
    setV(initial || { id: undefined, bookNo: "", owner: ownerOptions[0], status: "Free", price: 0 });
  }, [initial, open, ownerOptions]);

  const canSave = v?.bookNo?.trim() && v?.owner && v?.status;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <TextField
            label="Book no."
            value={v.bookNo || ""}
            onChange={(e) => setV((s) => ({ ...s, bookNo: e.target.value }))}
          />
          <FormControl fullWidth>
            <Select
              value={v.owner?.id ?? v.owner?.name ?? ""}
              onChange={(e) => {
                const next =
                  ownerOptions.find((o) => (o.id ?? o.name) === e.target.value) || ownerOptions[0];
                setV((s) => ({ ...s, owner: next }));
              }}
              displayEmpty
            >
              {ownerOptions.map((o) => (
                <MenuItem key={o.id ?? o.name} value={o.id ?? o.name}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={o.avatar} sx={{ width: 24, height: 24 }} />
                    <span>{o.name}</span>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Select
              value={v.status || "Free"}
              onChange={(e) => setV((s) => ({ ...s, status: e.target.value }))}
            >
              {["Rented", "Free"].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Price (Birr)"
            type="number"
            inputProps={{ step: "0.1" }}
            value={v.price ?? 0}
            onChange={(e) => setV((s) => ({ ...s, price: Number(e.target.value) }))}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!canSave}
          onClick={() => onSave(v)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ---------- Confirm dialog ---------- */
function ConfirmDialog({ open, title, description, onCancel, onConfirm }) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography color="text.secondary">{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}