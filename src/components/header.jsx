import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";

import Drawer from "./drawer";
import logo from "../assets/logo.png";
import MenuIcon from "@mui/icons-material/Menu";
const Header = () => {
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => setOpen(true);
  return (
    <Box
      style={{
        background: "#f5f3ef",
        display: "flex",
        justifyContent: "center",
      }}>
      <Box style={{ width: "80%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f5f3ef",
            height: "100px",
          }}>
          <Box
            style={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Box sx={{ height: "75%" }}>
              <img style={{ height: "100%" }} src={logo} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: "600" }}>
                Kitchen Inventory
              </Typography>
              <Typography>Admin Panel</Typography>
            </Box>
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
            }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerOpen}
              sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Drawer open={open} setOpen={setOpen} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
