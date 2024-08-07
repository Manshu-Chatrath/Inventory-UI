import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import StyledFormInput from "./styledFormInput";
import { LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment-timezone";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import TimeZoneSelector from "./timezoneSelector";
export default function DiscountModal({
  open,
  setOpen,
  selectedDish,
  mobileWidth,
  setDiscountDetails,
}) {
  const handleClose = () => setOpen(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const timeZoneErrorMessage = "Please select a timezone!";
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [timeZone, setTimeZone] = useState(null);
  const [timeErrorMessage, setTimeErrorMessage] = useState("");
  const [discount, setDiscount] = useState(false);
  const [dateErrorMessage, setDateErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const form = {
    percentage: {
      label: "Discount Percentage",
      name: "percentage",
      placeholder: "Add discount percentage",
      required: "Discount is required",
      type: "number",
      validate: {
        notNegativeOne: (value) => value !== "-1" || "Value cannot be -1", // Custom rule to prevent -1
      },
    },
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: mobileWidth ? "100%" : 400,
    minHeight: mobileWidth ? "100%" : 250,
    borderRadius: mobileWidth ? 0 : 5,
    backgroundColor: "white",
    boxShadow: 24,
    padding: 0,
    gap: 2,
  };
  const handleStartTimeChange = (time) => {
    setSelectedStartTime(moment(time.$d).valueOf());
  };

  const handleEndTimeChange = (time) => {
    setSelectedEndTime(moment(time.$d).valueOf());
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(moment(date.$d).valueOf());
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(moment(date.$d).valueOf());
  };

  const handleDiscountChange = (event, newStatus) => {
    if (newStatus !== null) {
      setDiscount(newStatus);
    }
  };

  function convertToMilliseconds(time, d) {
    const timeObject = new Date(time);
    const dateObject = new Date(d);
    const hours = timeObject.getHours();
    const minutes = timeObject.getMinutes();
    const date = dateObject.getDate();
    const month = dateObject.getMonth();
    const year = dateObject.getFullYear();
    let selectedMoment = moment({
      year: year,
      month: month,
      date: date,
      hours: hours,
      minutes: minutes,
    }).valueOf();

    return selectedMoment;
  }

  const onSubmit = (data) => {
    setIsSubmit(true);
    let errorExists = false;
    if (!selectedStartDate || !selectedEndDate) {
      setDateErrorMessage("Please select start and end date!");
      errorExists = true;
    }
    if (!selectedStartTime || !selectedEndTime) {
      setTimeErrorMessage("Please select start and end time!");
      errorExists = true;
    }
    if (!timeZone) {
      errorExists = true;
      setTimeErrorMessage("Please select a timezone!");
    }

    const startDiscountTime = convertToMilliseconds(
      selectedStartTime,
      selectedStartDate
    );
    const endDiscountTime = convertToMilliseconds(
      selectedEndTime,
      selectedEndDate
    );
    if (moment().valueOf() > startDiscountTime) {
      setTimeErrorMessage("Start time must be after current time!");
      errorExists = true;
    }
    if (startDiscountTime > endDiscountTime) {
      setTimeErrorMessage("End time must be after start time!");
      errorExists = true;
    }
    if (errorExists) {
      return;
    } else {
      setTimeErrorMessage("");
      setDateErrorMessage("");
    }

    setDiscountDetails({
      startDiscountDate: selectedStartDate,
      endDiscountDate: selectedEndDate,
      startDiscountTime: startDiscountTime,
      endDiscountTime: endDiscountTime,
      discountPercentage: data.percentage,
      timeZone: timeZone,
      discount: discount,
    });
    handleClose();
  };

  useEffect(() => {
    if (selectedDish?.discount) {
      setValue("percentage", selectedDish.discountPercentage);
      setSelectedStartTime(selectedDish.discountStartTime);
      setSelectedEndTime(selectedDish.discountEndTime);
      setSelectedStartDate(selectedDish.discountStartDate);
      setSelectedEndDate(selectedDish.discountEndDate);
      setDiscount(selectedDish.discount);
      setTimeZone(selectedDish.timeZone);
    }
  }, [selectedDish]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-category-modal"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Box style={{ padding: 20 }}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                color: "gray",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}>
              <CloseIcon />
            </IconButton>
            <Box style={{ textAlign: "center", marginBottom: 20 }}>
              <Typography
                id="modal-modal-title"
                variant="h5"
                style={{ textAligh: "center", fontWeight: "bold" }}>
                Add Discount
              </Typography>
            </Box>
            <TimeZoneSelector
              selectedTimeZone={timeZone}
              timeZoneErrorMessage={timeZoneErrorMessage}
              isSubmit={isSubmit}
              setSelectedTimeZone={setTimeZone}
            />
            <Box>
              <Box>
                <Typography variant="label" style={{ fontWeight: "bold" }}>
                  Discount Status:
                </Typography>
              </Box>

              <ToggleButtonGroup
                value={discount}
                exclusive
                onChange={handleDiscountChange}
                aria-label="Status">
                <ToggleButton
                  style={
                    discount
                      ? {
                          backgroundColor: "green",
                          color: "white",
                          fontWeight: "bold",
                        }
                      : null
                  }
                  value={true}
                  aria-label="Active">
                  Active
                </ToggleButton>
                <ToggleButton value={false} aria-label="Inactive">
                  Inactive
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box style={{ marginTop: "10px" }}>
              <StyledFormInput
                label={form["percentage"].label}
                register={register}
                form={form}
                property={"percentage"}
                errors={errors}
              />
            </Box>

            <Box style={{ display: "flex", marginTop: "10px" }}>
              <Box style={{ marginRight: "5px" }}>
                <Box>
                  <Typography variant="label" style={{ fontWeight: "bold" }}>
                    Start Date:
                  </Typography>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    minDate={dayjs()}
                    error={isSubmit && !selectedEndDate ? true : false}
                    onChange={handleStartDateChange}
                    value={dayjs(selectedStartDate)}
                    sx={{
                      margin: "auto",
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
                        color:
                          isSubmit && !selectedStartDate ? "#d32f2f" : "black",
                        fontWeight:
                          isSubmit && !selectedStartDate ? "bold" : "default",
                      },
                      "& .MuiInputBase-root": {
                        border:
                          isSubmit && !selectedStartDate
                            ? "1px solid #d32f2f"
                            : "default",
                      },
                      "& .MuiIconButton-root": {
                        color:
                          isSubmit && !selectedStartDate
                            ? "#d32f2f"
                            : "default",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                          isSubmit && !selectedStartDate
                            ? "#d32f2f !important"
                            : "rgba(0, 0, 0, 0.23) !important",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
              <Box>
                <Box>
                  <Typography variant="label" style={{ fontWeight: "bold" }}>
                    End Date:
                  </Typography>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    minDate={
                      selectedStartDate ? dayjs(selectedStartDate) : dayjs()
                    }
                    value={dayjs(selectedEndDate)}
                    onChange={handleEndDateChange}
                    error={isSubmit && !selectedEndDate ? true : false}
                    helperText={dateErrorMessage}
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
                        color:
                          isSubmit && !selectedEndDate ? "#d32f2f" : "black",
                        fontWeight:
                          isSubmit && !selectedEndDate ? "bold" : "default",
                      },
                      "& .MuiInputBase-root": {
                        border:
                          isSubmit && !selectedEndDate
                            ? "1px solid #d32f2f"
                            : "default",
                      },
                      "& .MuiIconButton-root": {
                        color:
                          isSubmit && !selectedEndDate ? "#d32f2f" : "default",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                          isSubmit && !selectedEndDate
                            ? "#d32f2f !important"
                            : "rgba(0, 0, 0, 0.23) !important",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>
            {isSubmit && (!selectedEndDate || !selectedStartDate) && (
              <label
                style={{
                  fontWeight: "bold",
                  color: "#d32f2f",
                  fontSize: 14,
                  marginLeft: "14px",
                }}>
                {dateErrorMessage}
              </label>
            )}
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}>
              <Box style={{ marginRight: "10px" }}>
                <Box>
                  <Typography variant="label" style={{ fontWeight: "bold" }}>
                    Start Time:
                  </Typography>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    error={true}
                    value={dayjs(selectedStartTime)}
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
                        color:
                          isSubmit && !selectedStartTime ? "#d32f2f" : "black",
                        fontWeight:
                          isSubmit && !selectedStartTime ? "bold" : "default",
                      },
                      "& .MuiInputBase-root": {
                        border:
                          isSubmit && !selectedStartTime
                            ? "1px solid #d32f2f"
                            : "default",
                      },
                      "& .MuiIconButton-root": {
                        color:
                          isSubmit && !selectedStartTime
                            ? "#d32f2f"
                            : "default",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                          isSubmit && !selectedStartTime
                            ? "#d32f2f !important"
                            : "rgba(0, 0, 0, 0.23) !important",
                      },
                    }}
                    onChange={handleStartTimeChange}
                  />
                </LocalizationProvider>
              </Box>

              <Box>
                <Box>
                  <Typography variant="label" style={{ fontWeight: "bold" }}>
                    End Time:
                  </Typography>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    error={isSubmit && !selectedEndTime ? true : false}
                    helperText={timeErrorMessage}
                    value={dayjs(selectedEndTime)}
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
                        color:
                          isSubmit && !selectedEndTime ? "#d32f2f" : "black",
                        fontWeight:
                          isSubmit && !selectedEndTime ? "bold" : "default",
                      },
                      "& .MuiInputBase-root": {
                        border:
                          isSubmit && !selectedEndTime
                            ? "1px solid #d32f2f"
                            : "default",
                      },
                      "& .MuiIconButton-root": {
                        color:
                          isSubmit && !selectedEndTime ? "#d32f2f" : "default",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                          isSubmit && !selectedEndTime
                            ? "#d32f2f !important"
                            : "rgba(0, 0, 0, 0.23) !important",
                      },
                    }}
                    onChange={handleEndTimeChange}
                  />
                </LocalizationProvider>
              </Box>
            </Box>
            {isSubmit && timeErrorMessage && (
              <label
                style={{
                  fontWeight: "bold",
                  color: "#d32f2f",
                  fontSize: 14,
                  marginLeft: "14px",
                }}>
                {timeErrorMessage}
              </label>
            )}
            <Box>
              <Button
                onClick={handleSubmit(onSubmit)}
                sx={{
                  backgroundColor: "green",
                  textTransform: "none",
                  fontWeight: "bold",
                  width: "100%",
                  marginTop: "10px",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#045d04", // Darker shade of green on hover
                  },
                }}>
                Add Discount
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
