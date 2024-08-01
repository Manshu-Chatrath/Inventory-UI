import { useState, useEffect } from "react";
import TableComponent from "../components/tableComponent";
import { CircularProgress, Box } from "@mui/material";
import Header from "../components/header";

import { useSelector, useDispatch } from "react-redux";
import DeleteModal from "../components/deleteModal";
import Search from "../components/search";
import CreateItemModal from "../components/createItemModal";
import {
  defaultItemStatus,
  getItems,
  deleteItem,
} from "../reducers/itemsSlice";
import { SUCCESS, PENDING } from "../reducers/constant";

export default function Items() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const itemStatusError = useSelector((state) => state.items.itemStatusError);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const handleModal = () => setOpen(true);
  const total = useSelector((state) => state.items.total);
  const [initial, setInitial] = useState(true);
  const itemStatus = useSelector((state) => state.items.itemStatus);
  const itemListStatus = useSelector((state) => state.items.itemListStatus);
  const itemList = useSelector((state) => state.items.itemList);
  const handleChange = (e) => {
    setTimeout(() => {
      setSearch(e.target.value);
      setPage(0);
    }, 300);
  };

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  useEffect(() => {
    if (itemListStatus === SUCCESS) {
      setList(itemList);
    }
  }, [itemListStatus]);

  useEffect(() => {
    if (itemStatus === SUCCESS) {
      setPage(0);
      dispatch(getItems({ page: 0, rowsPerPage: rowsPerPage, search: search }));
    }
  }, [itemStatus]);

  const handleDelete = () => {
    dispatch(deleteItem(selectedItem.id));
  };

  useEffect(() => {
    if (!initial) {
      dispatch(
        getItems({
          page: page * rowsPerPage,
          rowsPerPage: rowsPerPage,
          search: search,
        })
      );
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    dispatch(getItems({ page: 0, rowsPerPage: rowsPerPage, search: "" }));
    setInitial(false);
  }, []);

  return (
    <>
      <DeleteModal
        status={itemStatus}
        error={itemStatusError}
        setSelectedItem={setSelectedItem}
        open={openDeleteModal}
        defaultFunction={defaultItemStatus}
        setOpen={setOpenDeleteModal}
        handleDelete={handleDelete}
        description={"item"}
        warning={"The item will no longer be the part of the inventory."}
      />
      <CreateItemModal
        setSelectedItem={setSelectedItem}
        selectedItem={selectedItem}
        open={open}
        setOpen={setOpen}
      />
      <Header route={"Items"} />
      <Search placeholder={"Search any item"} handleChange={handleChange} />
      {itemListStatus === PENDING && list.length === 0 ? (
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
      ) : (
        <TableComponent
          title={"Inventory"}
          setSelectedItem={setSelectedItem}
          page={page}
          total={total}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setOpenDeleteModal={setOpenDeleteModal}
          handleModal={handleModal}
          rows={list}
          toolTipDescription={"Add Item in the inventory"}
        />
      )}
    </>
  );
}
