import { useState, useEffect } from "react";
import { TextField, Box, Typography } from "@mui/material";
import { capitalizeFirstLetter } from "../util";
import "../styles/index.css";
const CategorySelector = ({
  selectedCategory = null,
  setSelectedCategory,
  categories,
  isEdit = false,
  isSubmit = false,
}) => {
  const [categoriesList, setCategoriesList] = useState([]);
  useEffect(() => {
    setCategoriesList(categories);
  }, [categories]);
  const [categoryBox, setCategoryBox] = useState(false);

  const handleClick = (e) => {
    e.target.setAttribute("data-class", "categoryInputBox");
  };

  const [text, setText] = useState("");
  const handleDocumentClick = (event) => {
    if (event.target.getAttribute("data-class") !== "categoryInputBox") {
      setCategoryBox(false);
    } else {
      setCategoryBox(true);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    if (!categoryBox) {
      if (selectedCategory) {
        setText(capitalizeFirstLetter(selectedCategory.name));
      }
      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    }
  }, [categoryBox]);

  useEffect(() => {
    if (isEdit && selectedCategory?.name) {
      setText(capitalizeFirstLetter(selectedCategory.name));
    }
  }, [selectedCategory]);

  const handleChange = (e) => {
    setText(e.target.value);
    if (e.target.value === "") {
      setCategoriesList(categories);
    } else {
      const arr = categories.filter((category) =>
        category.name.startsWith(e.target.value.toLowerCase())
      );
      setCategoriesList(arr);
    }
  };

  return (
    <>
      <Box style={{ position: "relative" }}>
        <Box style={{ marginBottom: "5px" }}>
          <Typography variant="label" style={{ fontWeight: "bold" }}>
            Select a category:
          </Typography>
        </Box>
        <TextField
          data-class="categoryInputBox"
          onClick={handleClick}
          error={isSubmit && !selectedCategory ? true : false}
          value={text}
          helperText={
            isSubmit && !selectedCategory ? "Category is required" : ""
          }
          onChange={handleChange}
          sx={{
            margin: "auto",
            color: "black",
            transition: "opacity 0.25s ease-out !important",
            width: "100%",
            "& .MuiFormLabel-root": {
              color: "rgba(187,187,187,0.9) !important",
              fontWeight: "bold",
            },
            "& .Mui-focused": {
              color: "black",
            },
            "& .MuiFormHelperText-root": {
              color: "red",
              fontWeight: "bold",
            },
            "& .MuiInputBase-input": {
              padding: "10px",
            },
          }}
          placeholder={"Select a category"}
        />
        {categoryBox && (
          <div
            data-class="categoryInputBox"
            className="default-scrollbar"
            style={{
              position: "absolute",
              width: "100%",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              padding: "10px",
              maxHeight: "150px",
              overflowY: "auto",
              background: "white",
              zIndex: 1000,
              borderRadius: "5px",
            }}>
            {categories.length === 0 ? (
              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                Please create a category first
              </div>
            ) : categoriesList.length === 0 ? (
              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                No categories found
              </div>
            ) : (
              categoriesList.map((category) => (
                <div
                  onClick={() => {
                    setSelectedCategory(category);
                    setText(capitalizeFirstLetter(category.name));
                  }}
                  key={category.id}
                  data-class="categoryInputBox"
                  style={{
                    cursor: "pointer",
                    padding: "5px",
                    backgroundColor:
                      selectedCategory?.id === category?.id ? "skyblue" : null,
                    fontWeight:
                      selectedCategory?.id === category?.id ? "bold" : null,
                  }}>
                  {capitalizeFirstLetter(category.name)}
                </div>
              ))
            )}
          </div>
        )}
      </Box>
    </>
  );
};

export default CategorySelector;
