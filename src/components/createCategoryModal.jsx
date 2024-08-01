import { useState, useEffect } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { SUCCESS, FAILED } from "../reducers/constant";
import {
  defaultCategoryStatus,
  createCategory,
  editCategory,
} from "../reducers/categoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./loader";
import FormInput from "./formInput";
export default function CreateCategoryModal({
  open,
  setSelectedCategory,
  setOpen,
  categories,
  selectedCategory = null,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const categoryStatus = useSelector(
    (state) => state.categories.categoryStatus
  );
  const categoryStatusError = useSelector(
    (state) => state.categories.categoryStatusError
  );
  if (selectedCategory && open) {
    setValue("category", selectedCategory.name);
  }
  const [openLoader, setOpenLoader] = useState(false);
  const handleClose = () => {
    setOpenLoader(false);
    setOpen(false);
    if (categoryStatus === SUCCESS) {
      setOpenLoader(false);
      if (selectedCategory) {
        setSelectedCategory(null);
      }
      setValue("category", "");
      setOpen(false);
    }
  };
  const form = {
    category: {
      label: "Add Category",
      name: "category",
      placeholder: "Add Category",
      required: "Category is required",
      type: "text",
      validate: () => {
        if (categories.length >= 20) {
          return "You cannot have more than 20 categories";
        }
      },
    },
  };
  const key = "category";
  useEffect(() => {
    if (categoryStatus === SUCCESS || categoryStatus === FAILED) {
      setLoading(false);
    }
  }, [categoryStatus]);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    minHeight: 250,
    borderRadius: 5,
    backgroundColor: "white",
    boxShadow: 24,
    padding: 0,
    gap: 2,
  };
  const onSubmit = (data) => {
    setLoading(true);
    setOpenLoader(true);
    if (selectedCategory) {
      data.id = selectedCategory.id;
      dispatch(editCategory(data));
    } else {
      dispatch(createCategory(data));
    }
  };

  const onClose = () => {
    setOpenLoader(false);
    setOpen(false);
    if (categoryStatus === SUCCESS) {
      if (selectedCategory) {
        setSelectedCategory(null);
      }
      setValue("category", "");
      dispatch(defaultCategoryStatus());
    }
  };

  return (
    <>
      <Loader
        status={categoryStatus}
        loading={loading}
        errorMessage={categoryStatusError}
        onClose={onClose}
        open={openLoader}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-category-modal"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Box style={{ padding: 30 }}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                color: "gray",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}>
              <CloseIcon />
            </IconButton>
            <Box style={{ textAlign: "center", marginBottom: 20 }}>
              <Typography
                id="modal-modal-title"
                variant="h5"
                style={{ textAligh: "center", fontWeight: "bold" }}>
                {selectedCategory ? "Edit Category" : "Add Category (Max 20)"}
              </Typography>
            </Box>
            <Box style={{ marginBottom: "5px" }}>
              <Typography variant="label">Enter Category:</Typography>
            </Box>
            <FormInput
              name={form[key].name}
              placeholder={form[key].placeholder}
              required={form[key].required}
              message={errors?.[key]?.message}
              type={form[key].type}
              register={register}
              errors={errors?.[key]}
              validate={form[key].validate}
            />

            <Box>
              <Button
                onClick={handleSubmit(onSubmit)}
                sx={{
                  backgroundColor: "green",
                  textTransform: "none",
                  fontWeight: "bold",
                  width: "100%",
                  marginTop: "10px",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#045d04", // Darker shade of green on hover
                  },
                }}>
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
