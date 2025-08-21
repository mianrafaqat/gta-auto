import * as Yup from "yup";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect, useCallback } from "react";

import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControlLabel from "@mui/material/FormControlLabel";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useBoolean } from "src/hooks/use-boolean";
import { useResponsive } from "src/hooks/use-responsive";

import { _tags } from "src/_mock";

import { useSnackbar } from "src/components/snackbar";
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
} from "src/components/hook-form";

import PostDetailsPreview from "./post-details-preview";

// Import the blog API hooks
import { useCreatePost, useUpdatePost } from "src/api/blog";

// ----------------------------------------------------------------------

export default function PostNewEditForm({ currentPost }) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const preview = useBoolean();

  // Blog API hooks
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    content: Yup.string().required("Content is required"),
    coverUrl: Yup.mixed().nullable().required("Cover is required"),
    tags: Yup.array().min(2, "Must have at least 2 tags"),
    metaKeywords: Yup.array().min(1, "Meta keywords is required"),
    // not required
    metaTitle: Yup.string(),
    metaDescription: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentPost?.title || "",
      description: currentPost?.description || "",
      content: currentPost?.content || "",
      coverUrl: currentPost?.coverUrl || null,
      tags: currentPost?.tags || [],
      metaKeywords: currentPost?.metaKeywords || [],
      metaTitle: currentPost?.metaTitle || "",
      metaDescription: currentPost?.metaDescription || "",
    }),
    [currentPost]
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Prepare the blog data
      const blogData = {
        title: data.title,
        description: data.description,
        content: data.content,
        coverUrl:
          typeof data.coverUrl === "string"
            ? data.coverUrl
            : data.coverUrl?.preview,
        tags: data.tags || [],
        metaKeywords: data.metaKeywords || [],
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        publish: "published", // Default to published
        enableComments: true, // Default to enabled
      };

      console.log("🔍 Form submission - Blog data:", blogData);

      if (currentPost) {
        // Update existing post
        const postId = currentPost._id || currentPost.id || currentPost.blogID;
        console.log("🔍 Form submission - Available ID fields:", {
          _id: currentPost._id,
          id: currentPost.id,
          blogID: currentPost.blogID,
          selectedId: postId,
        });

        if (!postId) {
          throw new Error("Post ID not found in currentPost object");
        }

        const updateData = {
          id: postId,
          ...blogData,
        };
        console.log("🔍 Form submission - Update data:", updateData);
        console.log("🔍 Form submission - Current post:", currentPost);
        await updatePostMutation.mutateAsync(updateData);
        enqueueSnackbar("Update success!");
      } else {
        // Create new post
        await createPostMutation.mutateAsync(blogData);
        enqueueSnackbar("Create success!");
      }

      reset();
      preview.onFalse();
      router.push(paths.dashboard.post.root);
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message || "Something went wrong!", {
        variant: "error",
      });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("coverUrl", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue("coverUrl", null);
  }, [setValue]);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="title" label="Post Title" />

            <RHFTextField
              name="description"
              label="Description"
              multiline
              rows={3}
            />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="content" />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Cover</Typography>
              <RHFUpload
                name="coverUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <RHFTextField name="metaTitle" label="Meta title" />

            <RHFTextField
              name="metaDescription"
              label="Meta description"
              fullWidth
              multiline
              rows={3}
            />

            <RHFAutocomplete
              name="metaKeywords"
              label="Meta keywords"
              placeholder="+ Keywords"
              multiple
              freeSolo
              disableCloseOnSelect
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable comments"
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: "flex", alignItems: "center" }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <Button
          color="inherit"
          variant="outlined"
          size="large"
          onClick={preview.onTrue}>
          Preview
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={
            isSubmitting ||
            createPostMutation.isPending ||
            updatePostMutation.isPending
          }
          sx={{ ml: 2 }}>
          {!currentPost ? "Create Post" : "Save Changes"}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Grid>

      <PostDetailsPreview
        title={values.title}
        content={values.content}
        description={values.description}
        coverUrl={
          typeof values.coverUrl === "string"
            ? values.coverUrl
            : `${values.coverUrl?.preview}`
        }
        //
        open={preview.value}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={preview.onFalse}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
}

PostNewEditForm.propTypes = {
  currentPost: PropTypes.object,
};
