import { Box, Typography } from "@mui/material";
import FormInput from "./formInput";
const StyledFormInput = ({ form, property, register, errors, label }) => {
  const key = property;
  return (
    <>
      <Box style={{ marginBottom: "5px" }}>
        <Typography variant="label" style={{ fontWeight: "bold" }}>
          {label}:
        </Typography>
      </Box>
      <FormInput
        name={form[key]?.name}
        placeholder={form[key]?.placeholder}
        required={form[key]?.required}
        message={errors?.[key]?.message}
        type={form[key]?.type}
        register={register}
        errors={errors?.[key]}
        validate={form[key]?.validate}
      />
    </>
  );
};

export default StyledFormInput;
