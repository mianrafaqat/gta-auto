"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { useSnackbar } from "src/components/snackbar";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { paths } from "src/routes/paths";
import { useSettingsContext } from "src/components/settings";
import Iconify from "src/components/iconify";
import ForumService from "src/services/forum/forum.service";

const CATEGORY_ICONS = [
  { value: "forum", label: "Forum", icon: "eva:message-circle-fill" },
  { value: "chat", label: "Chat", icon: "eva:message-square-fill" },
  { value: "help", label: "Help", icon: "eva:question-mark-circle-fill" },
  { value: "feedback", label: "Feedback", icon: "eva:edit-fill" },
  { value: "announcement", label: "Announcement", icon: "eva:bell-fill" },
  { value: "event", label: "Event", icon: "eva:calendar-fill" },
  { value: "lightbulb", label: "Tips", icon: "eva:bulb-fill" },
  { value: "star", label: "Star", icon: "eva:star-fill" },
  { value: "heart", label: "Heart", icon: "eva:heart-fill" },
  { value: "folder", label: "Folder", icon: "eva:folder-fill" },
];

export default function ForumCategoryList() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    description: "",
  });

  // Load categories
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await ForumService.getAllCategories();
      if (response?.data?.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      enqueueSnackbar("Failed to load categories", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        // Update existing category
        const response = await ForumService.updateCategory(
          editingCategory._id,
          formData
        );
        if (response?.data?.success) {
          enqueueSnackbar("Category updated successfully!", {
            variant: "success",
          });
          loadCategories();
          handleCloseDialog();
        }
      } else {
        // Create new category
        const response = await ForumService.createCategory(formData);
        if (response?.data?.success) {
          enqueueSnackbar("Category created successfully!", {
            variant: "success",
          });
          loadCategories();
          handleCloseDialog();
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to save category",
        { variant: "error" }
      );
    }
  };

  // Handle delete category
  const handleDelete = async (categoryId) => {
    try {
      const response = await ForumService.deleteCategory(categoryId);
      if (response?.data?.success) {
        enqueueSnackbar("Category deleted successfully!", {
          variant: "success",
        });
        loadCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to delete category",
        { variant: "error" }
      );
    }
  };

  // Handle edit category
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      description: category.description || "",
    });
    setOpenDialog(true);
  };

  // Handle create new category
  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      icon: "",
      description: "",
    });
    setOpenDialog(true);
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      icon: "",
      description: "",
    });
  };

  // Get icon component
  const getCategoryIcon = (iconName) => {
    const iconMap = {
      forum: "eva:message-circle-fill",
      chat: "eva:message-square-fill",
      help: "eva:question-mark-circle-fill",
      feedback: "eva:edit-fill",
      announcement: "eva:bell-fill",
      event: "eva:calendar-fill",
      lightbulb: "eva:bulb-fill",
      star: "eva:star-fill",
      heart: "eva:heart-fill",
      folder: "eva:folder-fill",
    };
    return iconMap[iconName] || "eva:folder-fill";
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Forum Categories"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "Forum",
            href: paths.dashboard.root,
          },
          { name: "Categories" },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleCreate}
            sx={{
              bgcolor: "#4CAF50",
              color: "white",
              "&:hover": { bgcolor: "#45a049" },
            }}>
            Add Category
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Icon</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Topics</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography>Loading categories...</Typography>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography>No categories found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <Iconify
                        icon={getCategoryIcon(category.icon)}
                        sx={{ fontSize: 24, color: "#4CAF50" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {category.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {category.description || "No description"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={category.topicCount || 0}
                        size="small"
                        sx={{
                          bgcolor: "#4CAF50",
                          color: "white",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end">
                        <IconButton
                          onClick={() => handleEdit(category)}
                          sx={{ color: "#4CAF50" }}>
                          <Iconify icon="eva:edit-fill" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(category._id)}
                          sx={{ color: "error.main" }}>
                          <Iconify icon="eva:trash-2-fill" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>
          {editingCategory ? "Edit Category" : "Create New Category"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Category Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <FormControl fullWidth>
              <InputLabel>Icon</InputLabel>
              <Select
                value={formData.icon}
                label="Icon"
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                required>
                {CATEGORY_ICONS.map((icon) => (
                  <MenuItem key={icon.value} value={icon.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Iconify icon={icon.icon} />
                      {icon.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name || !formData.icon}
            sx={{
              bgcolor: "#4CAF50",
              color: "white",
              "&:hover": { bgcolor: "#45a049" },
            }}>
            {editingCategory ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
