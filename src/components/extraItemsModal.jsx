import React, { useState } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import StyledFormInput from "./styledFormInput";
export default function ExtraItemsModal({
  open,
  setOpen,
  changedExtraCategories,
  setChangedExtraCategories,
  setExtraCategories,
  selectedExtraCategory,
  mobileWidth,
  isEdit,
  extraCategories,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm();

  const [isActive, setIsActive] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [tab1Passed, setTab1Passed] = useState(false);

  const form = {
    extraCategory: {
      label: "Name",
      name: "extraCategory",
      placeholder: "Enter name",
      required: "Name is required",
      type: "text",
    },

    numberOfItems: {
      label: "Number of Items (Max 10)",
      name: "numberOfItems",
      placeholder: "Enter number of items",
      required: "Number of items is required",
      type: "number",
      validate: {
        notLessThanZero: (value) =>
          parseInt(value, 10) >= 0 || "Value cannot be less than 0", // Custom rule to ensure value is not less than 0
      },
    },
  };
  const handleClose = () => {
    setOpen(false);
    setIsActive(1);
    setTab1Passed(false);
    reset();
  };
  const Tab1 = () => {
    if (selectedExtraCategory) {
      setValue("extraCategory", selectedExtraCategory.name);
      setValue("numberOfItems", selectedExtraCategory.numberOfItems);
    }

    return (
      <>
        <Box style={{ marginTop: "20px" }}>
          <StyledFormInput
            label={form["extraCategory"].label}
            register={register}
            form={form}
            property={"extraCategory"}
            errors={errors}
          />
        </Box>

        <Box style={{ marginTop: "20px" }}>
          <StyledFormInput
            label={form["numberOfItems"].label}
            register={register}
            form={form}
            property={"numberOfItems"}
            errors={errors}
          />
        </Box>
      </>
    );
  };

  const Tab2 = () => {
    const arr = [];
    const items = selectedExtraCategory?.items;
    for (let i = 0; i < numberOfItems; i++) {
      const key = "item" + (i + 1);
      const key2 = "price" + (i + 1);
      form[key] = {
        label: "Item " + (i + 1),
        name: "item" + (i + 1),
        placeholder: "Enter item" + (i + 1),
        required: "item is required",
        type: "text",
      };
      form[key2] = {
        label: "Price",
        name: "price" + (i + 1),
        placeholder: "Enter price",
        required: "Price is required",
        type: "number",
        validate: {
          notLessThanZero: (value) =>
            parseInt(value, 10) >= 0 || "Value cannot be less than 0", // Custom rule to ensure value is not less than 0
        },
      };
      if (selectedExtraCategory) {
        setValue(key, items[i]?.name);
        setValue(key2, items[i]?.price);
      }
      arr.push(
        <React.Fragment key={i}>
          <Box style={{ marginTop: "20px" }}>
            <StyledFormInput
              label={form[key].label}
              register={register}
              form={form}
              property={key}
              errors={errors}
            />
          </Box>
          <Box style={{ marginTop: "20px" }}>
            <StyledFormInput
              label={form[key2]?.label}
              register={register}
              form={form}
              property={key2}
              errors={errors}
            />
          </Box>
        </React.Fragment>
      );
    }
    const key3 = "maxSelection";
    form[key3] = {
      label: " How many items client can select?",
      name: "maxSelection",
      placeholder: "Enter selection",
      required: "Selection is required",
      type: "number",
      validate: {
        notLessThanZero: (value) =>
          parseInt(value, 10) >= 0 || "Value cannot be less than 0", // Custom rule to ensure value is not less than 0
      },
    };

    if (selectedExtraCategory) {
      setValue("maxSelection", selectedExtraCategory.maxSelection);
    }
    arr.push(
      <React.Fragment key={100}>
        <Box style={{ marginTop: "20px" }}>
          <StyledFormInput
            label={form[key3].label}
            register={register}
            form={form}
            property={key3}
            errors={errors}
          />
        </Box>
      </React.Fragment>
    );
    return arr;
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: mobileWidth ? "100%" : 400,
    minHeight: mobileWidth ? "100%" : 250,
    maxHeight: mobileWidth ? "100%" : 500,
    overflowY: "auto",
    borderRadius: mobileWidth ? 0 : 5,
    backgroundColor: "white",
    boxShadow: 24,
    padding: 0,
    gap: 2,
  };
  const handleBack = () => {
    setIsActive(1);
  };
  const onSubmit = (data) => {
    if (isActive === 1) {
      if (
        data.numberOfItems % 1 !== 0 ||
        data.numberOfItems > 10 ||
        data.numberOfItems < 0
      ) {
        setError("numberOfItems", {
          type: "manual",
          message:
            "Number of items should be non-decimal, more than 0 and equal to or less than 10",
        });
      } else {
        setTab1Passed(true);
        setNumberOfItems(data.numberOfItems);
        setIsActive(2);
      }
    } else if (isActive === 2) {
      const arr = [...extraCategories];
      handleClose();
      setIsActive(1);
      setTab1Passed(false);
      const items = [];
      let i = 1;
      for (let key in data) {
        if (key.startsWith("item")) {
          items.push({ name: data["item" + i], price: data["price" + i] });
          i++;
        }
      }
      const obj = {
        items,
        maxSelection: data.maxSelection,
        name: data.extraCategory,
        numberOfItems: data.numberOfItems,
      };

      if (isEdit && selectedExtraCategory?.id) {
        obj.id = selectedExtraCategory.id;
        const newArr = [...changedExtraCategories];
        const itemIndex = newArr.findIndex(
          (item) => item.id === selectedExtraCategory.id
        );
        if (itemIndex === -1) {
          newArr.push({ ...obj, id: selectedExtraCategory.id });
        } else {
          newArr[itemIndex] = { ...obj, id: selectedExtraCategory.id };
        }
        setChangedExtraCategories(newArr);
      }
      if (selectedExtraCategory) {
        arr[selectedExtraCategory.index] = obj;
        setExtraCategories([...arr]);
      } else {
        setExtraCategories([...arr, obj]);
      }

      reset();
    }
  };
  return (
    <>
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
                Add Category
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {[1, 2].map((buttonNumber, index) => (
                  <Box key={index}>
                    <Button
                      onClick={() =>
                        buttonNumber === 1
                          ? setIsActive(1)
                          : buttonNumber === 2 && tab1Passed
                          ? setIsActive(2)
                          : null
                      }
                      sx={{
                        bgcolor:
                          isActive === index + 1 ? "green" : "transparent",
                        color: isActive === index + 1 ? "white" : "black",
                        borderRadius: "50%",
                        marginLeft: index === 0 ? "0px" : "10px",
                        border: "2px solid green",
                        "&:hover": {
                          bgcolor: isActive ? "green" : "transparent",
                          opacity: 0.8,
                        },
                      }}
                      style={{ width: "30px", height: "30px", minWidth: "0px" }}
                      key={buttonNumber}>
                      {buttonNumber}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
            {isActive === 1 ? <Tab1 /> : isActive === 2 ? <Tab2 /> : null}
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                alignSelf: "center",
              }}>
              <Box>
                <Button
                  variant="text"
                  onClick={handleBack}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    width: "100%",
                    color: "blue",
                    minWidth: "0px",
                    padding: "0px",
                  }}>
                  Back
                </Button>
              </Box>
              <Box>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  sx={{
                    backgroundColor: "green",
                    textTransform: "none",
                    fontWeight: "bold",
                    width: "100%",

                    color: "white",
                    "&:hover": {
                      backgroundColor: "#045d04", // Darker shade of green on hover
                    },
                  }}>
                  {isActive === 2 ? "Submit" : "Next"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
