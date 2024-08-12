import {
  Drawer,
  Button,
  Box,
  Typography,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { userLogOut } from "../reducers/authSlice";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloseIcon from "@mui/icons-material/Close";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu"; // A good choice for "dish"
import ClassIcon from "@mui/icons-material/Class"; // For "categories"
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LogoutIcon from "@mui/icons-material/Logout";
import { apiSlice } from "../reducers/apiSlice/apiSlice";
import { useDispatch } from "react-redux";
import { List, ListItem } from "@mui/material";
const RightSideDrawer = ({ open, setOpen, activeNav }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:450px)");
  const menuItems = [
    {
      name: "Menu",
      handleClick: () => navigate("/main"),
      icon: <MenuBookIcon />,
    },
    {
      name: "Add Dish",
      handleClick: () => navigate("/dish"),
      icon: <FastfoodIcon />,
    },
    {
      name: "Categories",
      handleClick: () => navigate("/category"),
      icon: <ClassIcon />,
    },
    {
      name: "Inventory",
      handleClick: () => navigate("/inventory"),
      icon: <RestaurantMenuIcon />,
    },

    {
      name: "Logout",
      handleClick: async () => {
        dispatch(userLogOut());
        navigate("/login", { replace: true });
        await apiSlice.post("/logout");
      },
      icon: <LogoutIcon />,
    },
  ];
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };
  return (
    <div>
      <Drawer
        anchor="right"
        open={open}
        PaperProps={{
          style: {
            width: isMobile ? "100%" : "300px", // Ensure the Paper component (visible part of the drawer) also has 40% width
            backgroundColor: "#f5f3ef", // Set the background color of the Drawer
          },
        }}
        onClose={toggleDrawer(false)}>
        <Box style={{ position: "relative" }}>
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
            sx={{
              position: "absolute",
              right: 8,
              zIndex: 1000,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
          <List style={{ width: "100%", paddingLeft: "20px" }}>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                height: "100px",
                marginLeft: "-5px",
              }}>
              <Box sx={{ height: "75%" }}>
                <img style={{ height: "100%" }} src={logo} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: "600" }}>
                  Kitchen Inventory
                </Typography>
                <Typography>Navigation</Typography>
              </Box>
            </Box>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <Button
                  style={{
                    color: "black",
                    fontWeight: activeNav === item?.name ? "bold" : "normal",
                  }}
                  startIcon={item.icon}
                  onClick={item.handleClick}>
                  {item.name}
                </Button>
              </ListItem>
            ))}
          </List>{" "}
        </Box>
      </Drawer>
    </div>
  );
};

export default RightSideDrawer;
