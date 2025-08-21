// AdminBooks.jsx
// Matches your UI: icon-only controls (Search, Sort, View, Filter),
// table columns: No., Author, Owner, Category, Book Name, Status,
// custom green status pill, localStorage persistence.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tooltip,
  Snackbar,
  Alert,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Popover,
  ToggleButtonGroup,
  ToggleButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  ButtonBase,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

// Top-right icons (as in your UI)
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";

// ---------- Mock data + persistence ----------
const LS_KEY = "admin-books-ui-match-v1";

const owners = [
  { id: 1, name: "Nardos T", avatar: "https://i.pravatar.cc/56?img=3" },
  { id: 2, name: "Alex Kim", avatar: "https://i.pravatar.cc/56?img=12" },
  { id: 3, name: "Lina M", avatar: "https://i.pravatar.cc/56?img=22" },
  { id: 4, name: "Sam P", avatar: "https://i.pravatar.cc/56?img=33" },
  { id: 5, name: "Irene H", avatar: "https://i.pravatar.cc/56?img=42" },
];

const categories = ["Fiction", "Non-fiction", "Science", "History", "Business"];
const authors = ["Harry", "Jane Doe", "Haruki Murakami", "Colleen Hoover", "Tana French"];
const bookNames = ["Drerto Gada", "Silent Spring", "Kafka on the Shore", "Atomic Habits", "The Searcher"];

function seedData(count = 32) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    author: authors[i % authors.length],
    owner: owners[i % owners.length],
    category: categories[i % categories.length],
    bookName: bookNames[i % bookNames.length],
    status: Math.random() > 0.15 ? "Active" : "Inactive",
  }));
}

const loadRows = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : seedData();
  } catch {
    return seedData();
  }
};
const saveRows = (rows) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(rows));
  } catch {}
};

// ---------- Styled: status pill to match your screenshot ----------
const StatusPill = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  position: "relative",
  height: 28,
  minWidth: 120,
  padding: "0 10px",
  borderRadius: 999,
  border: `1px solid ${active ? "#bbf7d0" : "#e5e7eb"}`,
  background: active ? "#dcfce7" : "#eef0f3",
  color: active ? "#14532d" : theme.palette.text.primary,
  fontSize: 12,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "flex-start",
  cursor: "pointer",
  transition: "all .2s ease",
  lineHeight: 1,
  paddingRight: 28,
  "& .label": {
    marginLeft: 0,
  },
  "& .knob": {
    position: "absolute",
    top: 4,
    right: active ? 4 : "auto",
    left: active ? "auto" : 4,
    width: 20,
    height: 20,
    borderRadius: 999,
    background: active ? "#0f7a33" : "#9ca3af",
    transition: "all .2s ease",
  },
}));

// ---------- Main page ----------
export default function AdminBooks() {
  const [rows, setRows] = useState(() => loadRows());

  // filters
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [stat, setStat] = useState("All");

  // view/sort controls
  const [density, setDensity] = useState("standard");
  const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: true,
    author: true,
    owner: true,
    category: true,
    bookName: true,
    status: true,
  });

  // icon popovers
  const [anchorSearch, setAnchorSearch] = useState(null);
  const [anchorSort, setAnchorSort] = useState(null);
  const [anchorView, setAnchorView] = useState(null);
  const [anchorFilter, setAnchorFilter] = useState(null);

  useEffect(() => {
    saveRows(rows);
  }, [rows]);

  const categoryOptions = useMemo(
    () => ["All", ...Array.from(new Set(rows.map((r) => r.category)))],
    [rows]
  );

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const matchQ =
        !q ||
        r.author.toLowerCase().includes(q) ||
        r.owner.name.toLowerCase().includes(q) ||
        r.bookName.toLowerCase().includes(q);
      const matchC = cat === "All" || r.category === cat;
      const matchS = stat === "All" || r.status === stat;
      return matchQ && matchC && matchS;
    });
  }, [rows, query, cat, stat]);

  const toggleStatus = useCallback((id) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r))
    );
  }, []);

  // DataGrid columns (no actions, just like your UI)
  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "No.",
        width: 80,
        valueFormatter: (p) => String(p.value).padStart(2, "0"),
      },
      {
        field: "author",
        headerName: "Author",
        flex: 1,
        minWidth: 140,
        renderCell: (params) => (
          <Typography variant="body2" color="text.secondary">
            {params.value ?? ""}
          </Typography>
        ),
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
        field: "category",
        headerName: "Category",
        flex: 1,
        minWidth: 140,
        renderCell: (params) => (
          <Chip size="small" color="primary" variant="outlined" label={params.value || ""} sx={{ fontWeight: 600 }} />
        ),
      },
      {
        field: "bookName",
        headerName: "Book Name",
        flex: 1.2,
        minWidth: 180,
        renderCell: (params) => (
          <Typography variant="body2" color="text.secondary">
            {params.value ?? ""}
          </Typography>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 180,
        renderCell: (params) => {
          const active = params.value === "Active";
          return (
            <StatusPill
              active={active ? 1 : 0}
              onClick={() => toggleStatus(params.row.id)}
              aria-label={active ? "Set inactive" : "Set active"}
            >
              <span className="label">{active ? "✓ Active" : "Inactive"}</span>
              <span className="knob" />
            </StatusPill>
          );
        },
      },
    ],
    [toggleStatus]
  );

  // Toggleable columns for View popover
  const toggleableCols = [
    { field: "id", label: "No." },
    { field: "author", label: "Author" },
    { field: "owner", label: "Owner" },
    { field: "category", label: "Category" },
    { field: "bookName", label: "Book Name" },
    { field: "status", label: "Status" },
  ];

  // Sort options popover
  const sortFields = [
    { field: "id", label: "No." },
    { field: "author", label: "Author" },
    { field: "owner", label: "Owner" },
    { field: "category", label: "Category" },
    { field: "bookName", label: "Book Name" },
    { field: "status", label: "Status" },
  ];

  const selectedSortField = sortModel?.[0]?.field || "id";
  const selectedSortDir = sortModel?.[0]?.sort || "asc";

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: "100%" }}>
      {/* Breadcrumbs */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Admin
        </Typography>
        <Typography color="text.disabled">/</Typography>
        <Typography variant="h6" color="text.secondary">
          Books
        </Typography>
      </Stack>

      <Paper elevation={1} sx={{ p: 2.5, borderRadius: 3 }}>
        {/* Title + icon toolbar (as in your UI) */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={1}
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            List of Owner
          </Typography>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="Search">
              <IconButton onClick={(e) => setAnchorSearch(e.currentTarget)} aria-label="Search">
                <SearchOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sort">
              <IconButton onClick={(e) => setAnchorSort(e.currentTarget)} aria-label="Sort">
                <SortOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View">
              <IconButton onClick={(e) => setAnchorView(e.currentTarget)} aria-label="View">
                <ViewListOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter">
              <IconButton onClick={(e) => setAnchorFilter(e.currentTarget)} aria-label="Filter">
                <TuneOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Table */}
        <Box sx={{ height: 580, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            density={density}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(m) => setColumnVisibilityModel(m)}
            sortModel={sortModel}
            onSortModelChange={(m) => setSortModel(m)}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
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
      </Paper>

      {/* Search popover */}
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
          placeholder="Author, owner, or book name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Stack direction="row" spacing={1} sx={{ mt: 1 }} justifyContent="flex-end">
          <Button size="small" onClick={() => setQuery("")}>Clear</Button>
          <Button size="small" variant="contained" onClick={() => setAnchorSearch(null)}>Apply</Button>
        </Stack>
      </Popover>

      {/* Sort popover */}
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
        <Stack spacing={1.5}>
          <FormControl size="small" fullWidth>
            <InputLabel>Field</InputLabel>
            <Select
              label="Field"
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
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} justifyContent="flex-end">
          <Button size="small" variant="contained" onClick={() => setAnchorSort(null)}>Done</Button>
        </Stack>
      </Popover>

      {/* View popover (density + columns) */}
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
          {toggleableCols.map((c) => (
            <FormControlLabel
              key={c.field}
              control={
                <Checkbox
                  size="small"
                  checked={Boolean(columnVisibilityModel[c.field])}
                  onChange={(e) =>
                    setColumnVisibilityModel((m) => ({ ...m, [c.field]: e.target.checked }))
                  }
                />
              }
              label={c.label}
            />
          ))}
        </FormGroup>
      </Popover>

      {/* Filter popover */}
      <Popover
        open={Boolean(anchorFilter)}
        anchorEl={anchorFilter}
        onClose={() => setAnchorFilter(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { p: 2, width: 340 } }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Filters
        </Typography>
        <Stack spacing={1.5}>
          <FormControl size="small" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select label="Category" value={cat} onChange={(e) => setCat(e.target.value)}>
              {categoryOptions.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={stat} onChange={(e) => setStat(e.target.value)}>
              {["All", "Active", "Inactive"].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} justifyContent="space-between">
          <Button size="small" onClick={() => { setCat("All"); setStat("All"); }}>
            Reset
          </Button>
          <Button size="small" variant="contained" onClick={() => setAnchorFilter(null)}>
            Apply
          </Button>
        </Stack>
      </Popover>
    </Box>
  );
}