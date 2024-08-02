import { useEffect, useState } from "react";
import TableComponent from "../components/tableComponent";
import Header from "../components/header";
import {
  defaultCategoryStatus,
  deleteCategory,
} from "../reducers/categoriesSlice";
import Loader from "../components/loader";
import Search from "../components/search";
import { getCategories } from "../reducers/categoriesSlice";
import CreateCategoryModal from "../components/createCategoryModal";
import { useDispatch, useSelector } from "react-redux";
import { FAILED, SUCCESS } from "../reducers/constant";
import DeleteModal from "../components/deleteModal";
export default function Category() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const handleModal = () => setOpen(true);
  const [search, setSearch] = useState("");
  const categoryStatus = useSelector(
    (state) => state.categories.categoryStatus
  );
  const categoriesListStatus = useSelector(
    (state) => state.categories.categoriesListStatus
  );
  const categoryStatusError = useSelector(
    (state) => state.categories.categoryStatusError
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categoriesList);

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  useEffect(() => {
    const arr = categories.filter((category) =>
      category.name.startsWith(search.toLowerCase())
    );
    setCategoriesList(arr);
  }, [search]);

  useEffect(() => {
    if (categoryStatus === SUCCESS) {
      dispatch(getCategories());
      setPage(0);
      setRowsPerPage(10);
    }
  }, [categoryStatus]);

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (categoriesListStatus === SUCCESS || categoriesListStatus === FAILED) {
      setLoading(false);
    }
  }, [categoriesListStatus]);

  useEffect(() => {
    const arr = [...categories];
    const newArr = arr.slice(page * rowsPerPage, rowsPerPage * (page + 1));
    setCategoriesList(newArr);
  }, [page, rowsPerPage, categories]);

  const handleDelete = () => {
    dispatch(deleteCategory(selectedItem.id));
  };

  const handleChange = (e) => {
    setTimeout(() => setSearch(e.target.value), 300);
  };

  return (
    <>
      <Loader
        onClose={onClose}
        open={open}
        status={categoriesListStatus}
        errorMessage={"Some error has occured"}
        loading={loading}
      />
      <DeleteModal
        status={categoryStatus}
        error={categoryStatusError}
        setSelectedItem={setSelectedItem}
        open={openDeleteModal}
        defaultFunction={defaultCategoryStatus}
        setOpen={setOpenDeleteModal}
        handleDelete={handleDelete}
        cate
        description={"category"}
        warning={"All dishes under this category will be deleted"}
      />
      <CreateCategoryModal
        max={20}
        categories={categories}
        setSelectedCategory={setSelectedItem}
        open={open}
        setOpen={setOpen}
        selectedCategory={selectedItem}
      />
      <Header activeNav={"Categories"} />
      <Search placeholder={"Search any category"} handleChange={handleChange} />
      <TableComponent
        title={"Categories"}
        setSelectedItem={setSelectedItem}
        page={page}
        total={categories.length}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        setOpenDeleteModal={setOpenDeleteModal}
        handleModal={handleModal}
        rows={categoriesList}
        toolTipDescription={"Create Category"}
      />
    </>
  );
}
