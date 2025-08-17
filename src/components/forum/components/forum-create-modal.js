import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Stack,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Iconify from "src/components/iconify";

const ForumCreateModal = ({ open, onClose, onSubmit, categories }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .min(10, "Title must be at least 10 characters")
      .max(200, "Title must not exceed 200 characters"),
    content: Yup.string()
      .required("Content is required")
      .min(50, "Content must be at least 50 characters"),
    category: Yup.string().required("Category is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        tags: selectedTags,
      };
      await onSubmit(formData);
      reset();
      setSelectedTags([]);
      onClose();
    } catch (error) {
      console.error("Error creating topic:", error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedTags([]);
    setTagInput("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Iconify icon="eva:edit-fill" sx={{ color: "#4CAF50" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Create New Topic
          </Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            {/* Title Field */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Topic Title"
                  placeholder="Enter a descriptive title for your topic..."
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="caption" color="text.secondary">
                          {field.value?.length || 0}/200
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Category Selection */}
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select {...field} label="Category">
                    {categories
                      .filter((cat) => cat._id !== "all")
                      .map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}>
                            <Iconify icon={getCategoryIcon(category.icon)} />
                            {category.name}
                          </Box>
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.category && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5 }}>
                      {errors.category.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            {/* Tags */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tags (optional)
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  placeholder="Add tags..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  sx={{ borderColor: "#4CAF50", color: "#4CAF50" }}>
                  Add
                </Button>
              </Box>
              {selectedTags.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {selectedTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      size="small"
                      sx={{
                        bgcolor: "#4CAF50",
                        color: "white",
                        "& .MuiChip-deleteIcon": {
                          color: "white",
                        },
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Content Field */}
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Topic Content"
                  placeholder="Share your thoughts, ask questions, or start a discussion..."
                  multiline
                  rows={8}
                  fullWidth
                  error={!!errors.content}
                  helperText={errors.content?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="caption" color="text.secondary">
                          {field.value?.length || 0} characters
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Guidelines */}
            <Alert
              severity="info"
              sx={{ bgcolor: "#4CAF5010", border: "1px solid #4CAF50" }}>
              <Typography variant="body2">
                <strong>Guidelines:</strong> Be respectful, stay on topic, and
                avoid spam. Your topic will be reviewed by moderators before
                being published.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              bgcolor: "#4CAF50",
              color: "white",
              px: 3,
              "&:hover": { bgcolor: "#45a049" },
            }}>
            {isSubmitting ? "Creating..." : "Create Topic"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Helper function to get category icons
const getCategoryIcon = (iconName) => {
  const iconMap = {
    forum: "eva:message-circle-fill",
    chat: "eva:message-square-fill",
    help: "eva:question-mark-circle-fill",
    feedback: "eva:edit-fill",
    announcement: "eva:bell-fill",
    event: "eva:calendar-fill",
    lightbulb: "eva:bulb-fill",
  };
  return iconMap[iconName] || "eva:folder-fill";
};

export default ForumCreateModal;
