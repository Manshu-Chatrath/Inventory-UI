import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Box, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { editItem } from "../reducers/itemsSlice";
import Loader from "./loader";
import { SUCCESS, FAILED } from "../reducers/constant";
import FormInput from "./formInput";
import { createItem, defaultItemStatus } from "../reducers/itemsSlice";
export default function CreateItemModal({
  open,
  setOpen,
  selectedItem,
  setSelectedItem,
}) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const itemStatus = useSelector((state) => state.items.itemStatus);
  const itemStatusError = useSelector((state) => state.items.itemStatusError);
  const [loading, setLoading] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const form = {
    name: {
      label: "Enter item name",
      name: "itemName",
      placeholder: "Enter item name",
      required: "Item name is required",
      type: "text",
    },
    quantity: {
      label: "Enter Quantity",
      name: "quantity",
      placeholder: "Enter Quantity",
      required: "Quantity is required",
      type: "number",
      validate: {
        notLessThanZero: (value) =>
          parseInt(value, 10) >= 0 || "Value cannot be less than 0", // Custom rule to ensure value is not less than 0
      },
    },
    threshold: {
      label: "Enter Alert Quantity Threshold",
      name: "threshold",
      placeholder: "Enter Alert Quantity Threshold",
      required: "Alert Quantity Threshold is required",
      type: "number",
      validate: {
        notLessThanZero: (value) =>
          parseInt(value, 10) >= 0 || "Value cannot be less than 0", // Custom rule to ensure value is not less than 0
      },
    },
  };

  const reset = () => {
    for (let key in form) {
      setValue(form[key].name, "");
    }
  };

  if (selectedItem && open) {
    for (let key in form) {
      setValue(form[key]?.name, selectedItem[key]);
    }
  }

  const onSubmit = (data) => {
    setLoading(true);
    setOpenLoader(true);
    if (selectedItem) {
      data.id = selectedItem.id;
      dispatch(editItem(data));
    } else {
      dispatch(createItem(data));
    }
  };

  const onClose = () => {
    setOpen(false);
    reset();
    if (selectedItem) {
      setSelectedItem(null);
    }
  };

  const handleClose = () => {
    setOpenLoader(false);
    if (itemStatus === SUCCESS) {
      setOpen(false);
      reset();
      if (selectedItem) {
        setSelectedItem(null);
      }
    }
    dispatch(defaultItemStatus());
  };
  const FormItem = ({ form, label, errors, property }) => {
    const key = property;
    return (
      <>
        <Box style={{ marginBottom: "5px", marginTop: "20px" }}>
          <Typography variant="label">{label}:</Typography>
        </Box>
        <FormInput
          name={form.name}
          placeholder={form.placeholder}
          required={form.required}
          message={errors?.[key]?.message}
          type={form.type}
          register={register}
          errors={errors?.[key]}
          validate={form.validate}
        />
      </>
    );
  };
  useEffect(() => {
    if (itemStatus === SUCCESS || itemStatus === FAILED) {
      setLoading(false);
    }
  }, [itemStatus]);

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

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Loader
            status={itemStatus}
            loading={loading}
            errorMessage={itemStatusError}
            onClose={handleClose}
            open={openLoader}
          />
          <Box style={{ padding: 30 }}>
            <IconButton
              aria-label="close"
              onClick={onClose}
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
                Add Item
              </Typography>
            </Box>
            {Object.keys(form).map((key) => (
              <FormItem
                key={key}
                property={key}
                form={form[key]}
                errors={errors}
                label={form[key].label}
              />
            ))}

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
