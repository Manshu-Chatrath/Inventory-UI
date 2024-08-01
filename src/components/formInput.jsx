import { TextField } from "@mui/material";
const FormInput = ({
  name,
  register,
  errors,
  validate,
  message,
  type,
  required,
  placeholder,
}) => {
  const hideSpinnerStyle = {
    "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
      {
        "-webkit-appearance": "none",
        margin: 0,
      },
    "& input[type=number]": {
      "-moz-appearance": "textfield", // Firefox
    },
  };

  return (
    <TextField
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
        "& .MuiInputBase-root": {
          padding: 0,
        },
      }}
      InputProps={{
        sx: hideSpinnerStyle,
      }}
      multiline={name === "description" ? true : false}
      rows={name === "description" ? 4 : 1}
      type={type}
      min={0}
      error={errors}
      helperText={message}
      placeholder={placeholder}
      {...register(name, {
        required: required,
        validate: validate,
      })}
    />
  );
};

export default FormInput;
