import { useState, useEffect } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";

import { Link } from "react-router-dom";
import FormInput from "../components/formInput";
import logo from "../assets/logo.png";
import React from "react";
const AuthForm = ({
  form,
  onSubmit,
  buttonTitle,
  type = null,
  errors,
  loading,
  register,
  errorMessage = null,
  handleSubmit,
}) => {
  const [isImageLoaded, setImageLoaded] = useState(false);
  const imageUrl =
    "https://www.publicdomainpictures.net/pictures/250000/velka/holz-hintergrund.jpg";

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setImageLoaded(true);
  }, [imageUrl]);

  const inputs = () => {
    let arr = [];
    let index = 0;
    for (let key in form) {
      arr.push(
        <React.Fragment key={index}>
          <Box style={{ width: "100%", marginBottom: 5 }}>
            <FormInput
              key={key}
              name={form[key].name}
              placeholder={form[key].placeholder}
              required={form[key].required}
              message={errors?.[key]?.message}
              type={form[key].type}
              register={register}
              errors={errors?.[key]}
              validate={form[key].validate}
            />
          </Box>
        </React.Fragment>
      );
      index++;
    }
    return arr;
  };

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        width: "100%",
        justifyContent: "center",
        backgroundImage: `url(${imageUrl})`,
        alignItems: "center",
        backgroundColor: "#ececec",
        transition: "background-image 1s ease-in-out",
        opacity: isImageLoaded ? 1 : 0,
        backgroundSize: "cover", // Ensure the image covers the full container
        backgroundPosition: "center", // Center the background image
      }}>
      <Grid
        style={{
          backgroundColor: "white",
          minHeight: "400px",
          padding: "20px",
        }}
        item
        xs={10}
        sm={6}
        md={4}
        lg={3}>
        {errorMessage && (
          <Box style={{ textAlign: "center" }}>
            <Typography
              variant="label"
              style={{
                textAlign: "center",
                fontWeight: "bolder",
                color: "red",
              }}>
              {errorMessage}
            </Typography>
          </Box>
        )}

        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Box style={{ width: "50%" }}>
            <img style={{ width: "100%" }} src={logo} />
          </Box>
          <Box>
            <Typography
              variant="h3"
              style={{ fontWeight: 500, fontSize: 36, textAlign: "center" }}>
              Kitchen Inventory
            </Typography>
          </Box>
          <Box style={{ marginTop: 10, width: "100%" }}>{inputs()}</Box>
          <Box style={{ width: "100%" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
              style={{
                backgroundColor: "#dc3545",
                width: "100%",
                marginTop: 10,
              }}>
              {buttonTitle}
            </Button>
          </Box>
          {type ? (
            <Box style={{ marginTop: 10 }}>
              <Link
                to={type === "login" ? "/signup" : "/login"}
                style={{
                  fontFamily: "sans-serif",
                  textDecoration: "none",
                  fontWeight: "400",
                }}>
                {type === "login" ? "New Supervisor?" : "Already have account?"}
              </Link>{" "}
              <Link
                to={type === "login" ? "/forgotPassword" : null}
                style={{
                  fontFamily: "sans-serif",
                  textDecoration: "none",
                  fontWeight: "400",
                }}>
                {type === "login" ? "Forgot Password?" : null}
              </Link>
            </Box>
          ) : null}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AuthForm;
