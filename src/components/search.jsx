import { Box, TextField } from "@mui/material";
const Search = ({ handleChange, placeholder }) => {
  const label = placeholder ? placeholder : "Search";
  return (
    <Box
      style={{
        width: "100%",
        justifyContent: "center",
        display: "flex",
        marginTop: "30px",
      }}>
      <Box style={{ width: "250px" }}>
        <TextField
          onChange={handleChange}
          id="standard-basic"
          label={label}
          variant="standard"
          style={{ width: "100%" }}
        />
      </Box>
    </Box>
  );
};
export default Search;
