import { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Typography,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import "../styles/index.css";
import { useDispatch, useSelector } from "react-redux";
import { defaultItemStatus, getItems } from "../reducers/itemsSlice";
import { capitalizeFirstLetter } from "../util";
import VisibilitySensor from "react-visibility-sensor";
import { PENDING } from "../reducers/constant";
const IngredientsSelector = ({
  selectedItems = [],
  setSelectedItems,
  removedSelectedItems,
  setRemovedSelectedItems,
  addedSelectedItems,
  setAddedSelectedItems,
  isEdit,
}) => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const count = 5;
  const [page, setPage] = useState(0);
  const itemListStatus = useSelector((state) => state.items.itemListStatus);
  const itemList = useSelector((state) => state.items.itemList);
  const total = useSelector((state) => state.items.total);
  const [itemBox, setItemBox] = useState(false);
  const handleClick = (e) => {
    e.target.setAttribute("data-class", "itemInputBox");
    dispatch(getItems({ page: 0, rowsPerPage: count, search: "" }));
  };

  const handleChange = (e) => {
    setList([]);
    setSearch(e.target.value);
    setTimeout(() => {
      setPage(0);
      dispatch(
        getItems({
          page: 0,
          rowsPerPage: count,
          search: e.target.value,
        })
      );
    }, 300);
  };

  useEffect(() => {
    if (list.length < total) {
      const arr = [...list, ...itemList];
      setList([...arr]);
    }
  }, [itemList, search]);

  const handleDocumentClick = (event) => {
    if (event.target.getAttribute("data-class") !== "itemInputBox") {
      setItemBox(false);
      dispatch(defaultItemStatus());
      setList([]);
      setPage(0);
      setSearch("");
    } else {
      setItemBox(true);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    if (!itemBox) {
      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    }
  }, [itemBox]);

  const onChange = (visible) => {
    if (visible && list.length < total) {
      const newPage = page + 1;
      dispatch(
        getItems({
          page: newPage * count,
          rowsPerPage: count,
          search: search,
        })
      );
      setPage(newPage);
    }
  };

  const renderItems = () => {
    const arr = [];
    list.map((item) =>
      arr.push(
        <div
          onClick={() => {
            let arr = [...selectedItems];
            let removedArr = [...removedSelectedItems];
            let addedArr = [...addedSelectedItems];
            if (selectedItems.includes(item.id)) {
              arr = arr.filter((id) => id !== item.id);
              if (isEdit) {
                addedArr = addedArr.filter((id) => id !== item.id);
                removedArr.push(item.id);
                setRemovedSelectedItems(removedArr);
              }
            } else {
              arr.push(item.id);
              if (isEdit) {
                removedArr = removedArr.filter((id) => id !== item.id);
                addedArr.push(item.id);
              }
            }
            if (isEdit) {
              setAddedSelectedItems(addedArr);
              setRemovedSelectedItems(removedArr);
            }
            setSelectedItems(arr);
          }}
          key={item.id}
          data-class="itemInputBox"
          style={{
            cursor: "pointer",
            padding: "5px",
            backgroundColor: selectedItems.includes(item.id) ? "skyblue" : null,
            fontWeight: selectedItems.includes(item.id) ? "bold" : null,
          }}>
          <Checkbox
            data-class="itemInputBox"
            onClick={(e) => {
              e.target.setAttribute("data-class", "itemInputBox");
            }}
            style={{ color: "black" }}
            checked={selectedItems.includes(item.id)}
          />
          {capitalizeFirstLetter(item.name)}
        </div>
      )
    );
    if (list.length < total) {
      arr.push(
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <div>
            <VisibilitySensor onChange={onChange}>
              <CircularProgress style={{ color: "black" }} size={25} />
            </VisibilitySensor>
          </div>
        </Box>
      );
    }

    return arr;
  };

  return (
    <>
      <Box style={{ position: "relative" }}>
        <Box style={{ marginBottom: "5px" }}>
          <Typography variant="label" style={{ fontWeight: "bold" }}>
            Select Ingredients:
          </Typography>
        </Box>
        <TextField
          data-class="itemInputBox"
          onClick={handleClick}
          value={itemBox ? search : `${selectedItems.length} are selected`}
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
          placeholder={"Select ingredients"}
        />
        {itemBox && (
          <div
            data-class="itemInputBox"
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
            {itemListStatus === PENDING && list.length === 0 ? (
              <Box>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "30px",
                  }}>
                  <Box>
                    <CircularProgress style={{ color: "black" }} />
                  </Box>
                </Box>
              </Box>
            ) : list.length === 0 && search === "" ? (
              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                Please create some items first!
              </div>
            ) : list.length === 0 && search !== "" ? (
              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                No items found
              </div>
            ) : (
              renderItems()
            )}
          </div>
        )}
      </Box>
    </>
  );
};

export default IngredientsSelector;
