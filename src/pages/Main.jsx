import { useEffect, useState } from "react";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Search from "../components/search";
import { getCategories } from "../reducers/categoriesSlice";
import Header from "../components/header";
import { getDishes, defaultDishListStatus } from "../reducers/dishSlice";
import HorizontalScroll from "../components/horizontalScroll";
import VisibilitySensor from "react-visibility-sensor";

import FoodItemCard from "../components/foodItemCard";
import { capitalizeFirstLetter } from "../util";
import { FAILED, PENDING, SUCCESS } from "../reducers/constant";
import { useNavigate } from "react-router-dom";
const Main = () => {
  const categories = useSelector((state) => state.categories.categoriesList);
  const categoryStatus = useSelector(
    (state) => state.categories.categoriesListStatus
  );

  const dishes = useSelector((state) => state.dishes.dishesList);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [dishList, setDishList] = useState([]);
  const navigate = useNavigate();
  const totalDishes = useSelector((state) => state.dishes.totalDishes);
  const count = 10;
  const [categoryId, setCategoryId] = useState(null);
  const [page, setPage] = useState(0);
  const dishesListStatus = useSelector(
    (state) => state.dishes.dishesListStatus
  );
  const dispatch = useDispatch();
  const handleEdit = (id) => {
    navigate(`/dish/${id}`);
  };
  useEffect(() => {
    if (dishList.length < totalDishes) {
      const arr = [...dishList, ...dishes];
      setDishList([...arr]);
    }
  }, [dishes, totalDishes]);

  useEffect(() => {
    dispatch(
      getDishes({
        page: 0,
        search: searchTerm,
        count: count,
        categoryId: categoryId,
      })
    );
    dispatch(getCategories());

    return () => {
      setDishList([]);
      dispatch(defaultDishListStatus());
    };
  }, []);

  const onClick = (id) => {
    setDishList([]);
    setCategoryId(id);
    setPage(0);
    dispatch(
      getDishes({
        page: 0,
        search: searchTerm,
        count: count,
        categoryId: id,
      })
    );
  };

  const onChange = (visible) => {
    if (visible) {
      let newPage = page + 1;
      dispatch(
        getDishes({
          page: newPage * 10,
          count: 10,
          categoryId: categoryId,
          search: searchTerm,
        })
      );
      setPage(newPage);
    }
  };

  const Loader = () => {
    return (
      <Box style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Box>
          <CircularProgress style={{ color: "black" }} size={30} />
        </Box>
      </Box>
    );
  };
  const handleChange = (e) => {
    setTimeout(() => {
      setDishList([]);
      setSearchTerm(e.target.value);
      setPage(0);
      dispatch(
        getDishes({
          page: 0,
          search: e.target.value,
          count: count,
          categoryId: categoryId,
        })
      );
    }, 300);
  };

  return (
    <Box
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        overflowX: "hidden",
        overflowY: "auto",
      }}>
      <Header activeNav={"Menu"} />
      {categoryStatus === PENDING ? (
        <Loader />
      ) : categoryStatus === FAILED ? (
        <Box style={{ textAlign: "center", fontWeight: "bold" }}>
          Some error has occured please try again!
        </Box>
      ) : categoryStatus === SUCCESS && categories.length === 0 ? (
        <Box
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Typography variant="h4">Please create categories first!</Typography>
        </Box>
      ) : (
        <>
          <Search placeholder={"Search any dish"} handleChange={handleChange} />
          <hr
            style={{
              color: "black",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              opacity: 0.4,
              height: "1px",
              width: "100%",
              marginTop: 30,
            }}
          />
          <HorizontalScroll
            setSelectedItem={setSelectedCategory}
            selectedItem={selectedCategory}
            onClick={onClick}
            rows={categories}
          />
          <Box style={{ textAlign: "center", marginTop: 30 }}>
            <Typography variant="h4">
              {categoryId
                ? capitalizeFirstLetter(selectedCategory?.name)
                : "All Items"}
            </Typography>
          </Box>
          <hr
            style={{
              color: "black",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              opacity: 0.4,
              height: "1px",
              width: "80%",
              marginTop: "1rem",
            }}
          />
          <Box
            style={{
              textAlign: "center",
              width: "100%",
              fontSize: "24px",
            }}>
            {dishesListStatus === PENDING && dishList.length === 0 ? (
              <Loader />
            ) : dishesListStatus === FAILED ? (
              "Some error has occured please try again!"
            ) : searchTerm && dishList.length === 0 ? (
              "No dishes found under this category."
            ) : dishesListStatus === SUCCESS && dishList.length === 0 ? (
              "Please Add Dishes."
            ) : null}
          </Box>

          <Grid
            container
            sx={{
              width: "80%",
              margin: "0 auto",
            }}>
            {dishList.map((dish) => (
              <Grid
                style={{ marginBottom: "30px" }}
                xs={12}
                md={4}
                lg={3}
                key={dish.id}
                item>
                <FoodItemCard handleEdit={handleEdit} dish={dish} />
              </Grid>
            ))}
            {dishList.length < totalDishes && dishList.length > 9 && (
              <Box style={{ display: "flex", justifyContent: "center" }}>
                <div>
                  <VisibilitySensor onChange={onChange}>
                    <CircularProgress style={{ color: "black" }} size={25} />
                  </VisibilitySensor>
                </div>
              </Box>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Main;
