import { useEffect, useState } from "react";
import { TextField, Box, Typography, Autocomplete } from "@mui/material";

import * as timeZone from "moment-timezone";

const TimeZoneSelector = ({
  setSelectedTimeZone,
  selectedTimeZone = "",
  isSubmit,
  timeZoneErrorMessage,
}) => {
  const [timezones, setTimezones] = useState([]);
  const getTimeZones = () => {
    const timeZones = timeZone.tz.names();
    return timeZones.map((tz) => {
      const now = timeZone.tz(tz);
      const abbreviation = now.format("z");
      const offset = now.format("Z");
      const parts = tz.split("/");
      const cityName = parts.pop().replace("_", " ");
      const countryName = parts.join("/").replace("_", " ");
      return {
        label: `${cityName}, ${countryName} (${abbreviation}, ${offset})`,
        value: tz,
      };
    });
  };

  const handleChange = (event, newValue) => {
    setSelectedTimeZone(newValue.value);
  };

  useEffect(() => {
    const allTimeZones = getTimeZones();
    setTimezones([...allTimeZones]);
  }, []);

  return (
    <>
      <Box style={{ marginBottom: "5px" }}>
        <Typography variant="label" style={{ fontWeight: "bold" }}>
          Select a timezone:
        </Typography>
      </Box>
      <Box sx={{ width: "100%", marginBottom: "5px" }}>
        <Autocomplete
          options={timezones}
          value={selectedTimeZone}
          disablePortal
          onChange={handleChange}
          style={{ padding: "0px" }}
          getOptionLabel={(option) => (option?.value ? option.value : option)}
          sx={{
            "& .MuiAutocomplete-input": {
              padding: "0px",
              fontSize: "16px",
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select a timezone"
              style={{ padding: "0px" }}
              error={isSubmit && !selectedTimeZone}
              helperText={
                isSubmit && !selectedTimeZone ? timeZoneErrorMessage : ""
              }
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                style: {
                  // Add your styles here
                  color: "black", // Example: Change text color
                  padding: "2.5px 5px 2.5px 5px", // Example: Change padding
                },
              }}
              sx={{
                margin: "auto",
                color: "black",
                transition: "opacity 0.25s ease-out !important",
                width: "100%",
                "& .MuiFormLabel-root": {
                  color: "rgba(187,187,187,0.9) !important",
                },
                "& .MuiOutlinedInput-input": {
                  padding: "0px",
                },
                "& .Mui-focused": {
                  color: "black",
                },

                "& .MuiFormHelperText-root": {
                  color: "red",
                  fontWeight: "bold",
                },
              }}
            />
          )}
        />
      </Box>
    </>
  );
};

export default TimeZoneSelector;
