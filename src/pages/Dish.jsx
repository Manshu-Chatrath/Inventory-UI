import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "../components/header";
import {
  Box,
  ToggleButtonGroup,
  Button,
  ToggleButton,
  Tooltip,
  IconButton,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Loader from "../components/loader";
import DeleteModal from "../components/deleteModal";
import { getCategories } from "../reducers/categoriesSlice";
import CategorySelector from "../components/categorySelector";
import IngredientsSelector from "../components/ingredientsSelector";
import StyledFormInput from "../components/styledFormInput";
import { useDropzone } from "react-dropzone";
import {
  getDish,
  deleteDish,
  createDish,
  defaultSelectedDishStatus,
  editDish,
  defaultDishStatus,
  defaultUploadStatus,
  imageUpload,
} from "../reducers/dishSlice";
import DiscountModal from "../components/discountModal";
import ExtraCategoriesBox from "../components/extraCategoriesBox";
import ExtraItemsModal from "../components/extraItemsModal";
import { FAILED, SUCCESS } from "../reducers/constant";

const Dish = ({ isEdit = false }) => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fileInputRef = useRef(null);
  const [openDiscountModal, setDiscountModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState("active");
  const [discount, setDiscount] = useState(false);
  const [discountDetails, setDiscountDetails] = useState(null);
  const [selectedExtraCategory, setSelectedExtraCategory] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [addedSelectedItems, setAddedSelectedItems] = useState([]);
  const [removedSelectedItems, setRemovedSelectedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [extraCategories, setExtraCategories] = useState([]);
  const selectedDishStatus = useSelector(
    (state) => state.dishes.selectedDishStatus
  );
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [changedExtraCategories, setChangedExtraCategories] = useState([]);
  const dishStatus = useSelector((state) => state.dishes.dishesStatus);

  const [removeExtraCategories, setRemoveExtraCategories] = useState([]);

  const uploadStatus = useSelector((state) => state.dishes.uploadStatus);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const id = useParams()?.id;
  const selectedDish = useSelector((state) => state.dishes.selectedDish);
  const [loaderOpen, setLoaderOpen] = useState(false);
  const dishId = useSelector((state) => state.dishes.dishId);
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setBackgroundImageUrl(url);
    }
  }, []);

  useEffect(() => {
    if (uploadStatus === SUCCESS || uploadStatus === FAILED) {
      setLoading(false);
    }
  }, [uploadStatus]);

  useEffect(() => {
    if (dishStatus === SUCCESS && !openDeleteModal) {
      const id = isEdit ? selectedDish?.id : dishId;
      if (imageFile) {
        dispatch(imageUpload({ file: imageFile, id }));
      }
    }
    if ((dishStatus === SUCCESS && isEdit) || dishStatus === FAILED) {
      setLoading(false);
    }
  }, [dishStatus, openDeleteModal, imageFile, selectedDish]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
    if (isEdit) {
      dispatch(getDish({ id: id }));
    }
    return () => {
      setExtraCategories([]);
      setSelectedCategory(null);
      setBackgroundImageUrl("");
      setValue("itemName", null);
      setValue("price", null);
      setSelectedCategory(null);
      setValue("description", null);
      setStatus("active");
      setDiscount(false);
      setSelectedItems([]);
      dispatch(defaultSelectedDishStatus());
    };
  }, [id]);

  const categories = useSelector((state) => state.categories.categoriesList);
  const handleStatusChange = (event, newStatus) => {
    if (newStatus !== null) {
      setStatus(newStatus);
    }
  };

  const handleDiscountChange = (event, newStatus) => {
    if (newStatus !== null) {
      setDiscount(newStatus);
    }
    setDiscountModal(true);
  };
  const mobileWidth = useMediaQuery("(max-width:500px)");
  const handleDeleteDish = () => {
    dispatch(deleteDish({ id: selectedDish.id }));
  };

  const form = {
    itemName: {
      label: "Name",
      name: "itemName",
      placeholder: "Enter item name",
      required: "Name is required",
      type: "text",
    },
    price: {
      label: "Price",
      name: "price",
      placeholder: "Enter Price",
      required: "Price is required",
      type: "number",
      validate: {
        notLessThanZero: (value) =>
          parseInt(value, 10) >= 0 || "Value cannot be less than 0", // Custom rule to ensure value is not less than 0
      },
    },
    description: {
      label: "Description",
      component: "textarea",
      name: "description",
      placeholder: "Enter Description",
      required: "Description is required",
      type: "text",
    },
    dragAndDrop: {},
  };

  useEffect(() => {
    if (isEdit) {
      if (
        !selectedDish &&
        (selectedDishStatus !== SUCCESS || selectedDishStatus !== FAILED)
      ) {
        setLoading(true);
      }
      if (selectedDishStatus === SUCCESS) {
        setLoading(false);
      }
    }
  }, [selectedDishStatus]);

  useEffect(() => {
    if (selectedDish && categories && isEdit) {
      setBackgroundImageUrl(selectedDish.src);
      setValue("itemName", selectedDish.name);
      setValue("price", selectedDish.price);
      setValue("description", selectedDish.description);
      setStatus(selectedDish.isActive ? "active" : "inactive");
      setDiscount(selectedDish.discount);
      const selectedIngredientsIds = selectedDish?.items.map((i) => i.id);
      setSelectedItems(selectedIngredientsIds);

      const arr = [];
      selectedDish?.extras?.forEach((category) => {
        const obj = {
          id: category.id,
          name: category.name,
          numberOfItems: category.extras.length,
          maxSelection: category.allowedItems,
          items: [...category.extras],
        };
        arr.push(obj);
      });
      setExtraCategories([...arr]);
      setSelectedCategory(
        categories.find((category) => category.id === selectedDish.categoryId)
      );
    }
  }, [selectedDish, categories]);

  const onSubmit = (data) => {
    setIsSubmit(true);
    if (!isEdit && !imageFile) return;
    setLoaderOpen(true);
    setLoading(true);
    if (isEdit) {
      dispatch(
        editDish({
          ...data,
          status,
          discount,
          removedSelectedItems,
          addedSelectedItems,
          selectedCategory,
          id: selectedDish.id,
          extraCategories,
          discountDetails,
          changedExtraCategories,
          removeExtraCategories,
        })
      );
    } else {
      dispatch(
        createDish({
          ...data,
          status,
          discount,
          selectedItems,
          selectedCategory,
          extraCategories,
          discountDetails,
        })
      );
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBackgroundImageUrl(url);
      setImageFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const onClose = () => {
    if (uploadStatus === SUCCESS) {
      dispatch(defaultDishStatus());
      dispatch(defaultUploadStatus());
      navigate("/dishes", { replace: true });
    }
    setLoaderOpen(false);
  };

  return (
    <Box>
      {isEdit ? (
        !selectedDish ? (
          <Loader
            onClose={onClose}
            open={false}
            status={selectedDishStatus}
            errorMessage={"Some error has occured"}
            loading={loading}
          />
        ) : selectedDish ? (
          <Loader
            onClose={onClose}
            open={loaderOpen}
            status={selectedDishStatus}
            errorMessage={"Some error has occured"}
            loading={loading}
          />
        ) : null
      ) : (
        <Loader
          onClose={onClose}
          open={loaderOpen}
          status={dishStatus !== SUCCESS ? dishStatus : uploadStatus}
          errorMessage={"Some error has occured"}
          loading={loading}
        />
      )}
      <Header />
      {isEdit && selectedDishStatus === SUCCESS && !selectedDish ? (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Typography variant="h4">No Dish Found</Typography>
        </Box>
      ) : isEdit && selectedDishStatus === FAILED ? (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Typography variant="h4">No Dish Found</Typography>
        </Box>
      ) : (
        <>
          <DeleteModal
            status={dishStatus}
            error={"Some error has occured"}
            setSelectedItem={() => null}
            open={openDeleteModal}
            defaultFunction={defaultDishStatus}
            setOpen={setOpenDeleteModal}
            handleDelete={handleDeleteDish}
            description={"Dish"}
            warning={"The dish and all its extras will be removed."}
          />
          <ExtraItemsModal
            changedExtraCategories={changedExtraCategories}
            setChangedExtraCategories={setChangedExtraCategories}
            extraCategories={extraCategories}
            mobileWidth={mobileWidth}
            setExtraCategories={setExtraCategories}
            setOpen={setOpenModal}
            isEdit={isEdit}
            selectedExtraCategory={selectedExtraCategory}
            open={openModal}
          />
          <Box display={"flex"} justifyContent={"center"}>
            <Box
              style={{
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                minHeight: "100vh",
                borderRadius: "10px",
                marginTop: mobileWidth ? "0px" : "40px",
                marginBottom: mobileWidth ? 0 : "40px",
                width: mobileWidth ? " 100%" : "80%",
                padding: "20px",
              }}>
              <Typography variant="h4" style={{ textAlign: "center" }}>
                {isEdit ? "Edit Dish" : "Add Dish"}
              </Typography>
              <DiscountModal
                open={openDiscountModal}
                mobileWidth={mobileWidth}
                discountDetails={discountDetails}
                selectedDish={selectedDish}
                isEdit={isEdit}
                setDiscountDetails={setDiscountDetails}
                setOpen={setDiscountModal}
              />
              {Object.keys(form).map((key, index) => {
                if (form?.[key]) {
                  if (key === "dragAndDrop") {
                    return (
                      <React.Fragment key={index}>
                        <Box
                          {...getRootProps()}
                          sx={{
                            width: "100%",
                            marginTop: "20px",
                            border:
                              isSubmit && !backgroundImageUrl
                                ? "2px dotted red"
                                : "2px dotted black",
                            color: "green",
                            p: 4,
                            display: "flex",
                            borderRadius: "5px",
                            flexDirection: "column",
                            backgroundPosition: "center",
                            alignItems: "center",
                            backgroundImage: `url(${backgroundImageUrl})`,
                            backgroundRepeat: "no-repeat",
                            justifyContent: "center",
                            gap: 2,
                            "&:hover": {
                              bgcolor: "lightblue", // Slightly darker on hover
                            },
                          }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              color: "black",
                              textAlign: "center",
                            }}>
                            Drag your image here
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              color: "black",
                              textAlign: "center",
                            }}>
                            or
                          </Typography>
                          <div>
                            <input
                              style={{ display: "none" }}
                              {...getInputProps()}
                              id="file-upload"
                              accept="image/*"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              type="file"
                            />
                            <label htmlFor="file-upload">
                              <Button
                                onClick={handleButtonClick}
                                sx={{
                                  border: "2px solid green",
                                  marginTop: "8px",
                                  bgcolor: "transparent",
                                  color: "green",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                  "&:hover": {
                                    bgcolor: "transparent",
                                    opacity: 0.8,
                                  },
                                }}>
                                Browse file
                              </Button>
                            </label>
                          </div>
                        </Box>
                        {isSubmit && !backgroundImageUrl && (
                          <label style={{ color: "red", fontWeight: "bold" }}>
                            Image is required!
                          </label>
                        )}
                      </React.Fragment>
                    );
                  }
                  return (
                    <React.Fragment key={index}>
                      <Box style={{ marginTop: "20px" }}>
                        <StyledFormInput
                          key={key}
                          label={form[key].label}
                          register={register}
                          form={form}
                          property={key}
                          errors={errors}
                        />
                      </Box>
                    </React.Fragment>
                  );
                }
              })}
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                  alignItems: "center",
                }}>
                <Box>
                  <Typography variant="label" style={{ fontWeight: "bold" }}>
                    Add Extra Categories (Max 8):
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title={"Click To Create Extra Category"}>
                    <IconButton
                      onClick={() => {
                        setSelectedExtraCategory(null);
                        setOpenModal(true);
                      }}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <ExtraCategoriesBox
                removeExtraCategories={removeExtraCategories}
                setRemoveExtraCategories={setRemoveExtraCategories}
                openModal={openModal}
                setOpenModal={setOpenModal}
                mobileWidth={mobileWidth}
                extraCategories={extraCategories}
                isEdit={isEdit}
                setSelectedExtraCategory={setSelectedExtraCategory}
                setExtraCategories={setExtraCategories}
              />

              <Box style={{ marginTop: "20px" }}>
                <CategorySelector
                  isEdit={isEdit}
                  selectedDish={selectedDish}
                  setSelectedCategory={setSelectedCategory}
                  selectedCategory={selectedCategory}
                  categories={categories}
                  isSubmit={isSubmit}
                />
              </Box>
              <Box style={{ marginTop: "20px" }}>
                <IngredientsSelector
                  setRemovedSelectedItems={setRemovedSelectedItems}
                  removedSelectedItems={removedSelectedItems}
                  addedSelectedItems={addedSelectedItems}
                  setAddedSelectedItems={setAddedSelectedItems}
                  isEdit={isEdit}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                />
              </Box>
              <Box
                display="flex"
                style={{ marginTop: "20px" }}
                alignItems="center"
                gap={2}>
                <Typography variant="label" style={{ fontWeight: "bold" }}>
                  Status:
                </Typography>
                <ToggleButtonGroup
                  value={status}
                  exclusive
                  onChange={handleStatusChange}
                  aria-label="Status">
                  <ToggleButton
                    style={
                      status === "active"
                        ? {
                            backgroundColor: "green",
                            color: "white",
                            fontWeight: "bold",
                          }
                        : {}
                    }
                    value="active"
                    aria-label="Active">
                    Active
                  </ToggleButton>
                  <ToggleButton
                    style={
                      status === "inactive"
                        ? {
                            backgroundColor: "green",
                            color: "white",
                            fontWeight: "bold",
                          }
                        : {}
                    }
                    value="inactive"
                    aria-label="Inactive">
                    Inactive
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Box
                display="flex"
                style={{ marginTop: "20px" }}
                alignItems="center"
                gap={2}>
                <Typography variant="label" style={{ fontWeight: "bold" }}>
                  Discount:
                </Typography>
                <Button onClick={handleDiscountChange}>Edit Discount</Button>
              </Box>
              {isEdit ? (
                <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Box>
                    <Button
                      onClick={handleSubmit(onSubmit)}
                      sx={{
                        backgroundColor: "green",
                        borderRadius: "8px",
                        textTransform: "none",
                        boxShadow: "none",
                        paddingLeft: "15px",
                        paddingRight: "15px",
                        fontWeight: "bold",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#045d04", // Darker shade of green on hover
                        },
                      }}
                      startIcon={<SaveIcon />}>
                      SAVE
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      onClick={() => setOpenDeleteModal(true)}
                      sx={{
                        backgroundColor: "red",
                        textTransform: "none",
                        color: "white",
                        borderRadius: "8px",
                        paddingLeft: "15px",
                        paddingRight: "15px",
                        fontWeight: "bold",
                        boxShadow: "none",

                        marginLeft: "8px", // Add some space between the buttons
                        "&:hover": {
                          backgroundColor: "#a30000", // Darker shade of red on hover
                        },
                      }}
                      startIcon={<DeleteIcon />}>
                      DELETE
                    </Button>
                  </Box>
                </Box>
              ) : (
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
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Dish;
