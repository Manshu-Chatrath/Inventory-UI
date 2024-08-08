import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import moment from "moment-timezone";
import { Button, CardActionArea, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit"; // Importing the Edit icon
const FoodItemCard = ({ dish, handleEdit }) => {
  const [isHover, setHover] = useState(false);
  const calculateDiscount = () => {
    return dish.price - (dish.price * dish.discount) / 100;
  };

  return (
    <Card
      onMouseEnter={() => setHover(true)} // Set hover state to true when mouse enters
      onMouseLeave={() => setHover(false)} // Set hover state to false when mouse leaves
      sx={{
        position: "relative",
        boxShadow: "3px 3px 5px 6px #ccc",
        borderRadius: "20px",
        marginLeft: "5%",
        marginRight: "5%",
        width: "90%",
      }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={dish.src}
          alt="green iguana"
        />
        <CardContent>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Box>
              <Typography style={{ fontWeight: "bold", fontSize: "16px" }}>
                {dish.name}
              </Typography>
            </Box>
            <Box>
              <Typography
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                }}>
                {moment.utc().valueOf() >= dish?.discountStartTime &&
                moment.utc().valueOf() < dish?.discountEndTime &&
                dish?.discount ? (
                  <>
                    <span>{"$" + calculateDiscount()}</span>
                    <span
                      style={{
                        marginLeft: "10px",
                        color: "red",
                        textDecoration: "line-through",
                      }}>
                      {"$" + dish.price}
                    </span>
                  </>
                ) : (
                  "$" + dish.price
                )}
              </Typography>
            </Box>
          </Box>

          <Box>
            {dish?.lowIngeredients ? (
              <Typography
                style={{
                  textAlign: "center",
                  color: "red",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}>
                Some ingredients of this dish are low in stock! Please check the
                inventory!
              </Typography>
            ) : null}
          </Box>
        </CardContent>
      </CardActionArea>
      {isHover && ( // Conditionally render this Box based on hover state
        <Box
          onClick={() => handleEdit(dish.id)} // Add onClick handler
          sx={{
            position: "absolute",
            cursor: "pointer",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0, // Initially hidden
            transition: "opacity 0.5s ease",
            "&:hover": {
              opacity: 1, // Show on hover
            },
          }}>
          <Button
            variant="text"
            disableRipple
            startIcon={<EditIcon />} // Add the Edit icon
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "transparent", // Override hover background color
              },
            }}>
            Edit
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default FoodItemCard;
