import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { SUCCESS, FAILED } from "../reducers/constant"; // Assuming these are exported from your constants file
const Loader = ({
  status,
  open,
  loading,
  onClose,
  errorMessage = "Some error occured!",
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    color: status === FAILED ? "red" : "black",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "25px",
    textAlign: "center",
    width: status === FAILED ? 250 : 200,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  };
  return (
    <Modal
      open={loading || open}
      onClose={onClose}
      aria-labelledby="status-modal-title"
      aria-describedby="status-modal-description">
      <Box sx={style}>
        {loading ? (
          <CircularProgress style={{ color: "grey" }} />
        ) : (
          <>
            <Typography
              id="status-modal-title"
              style={{ fontWeight: "bold" }}
              variant="h6"
              component="h2">
              {status === SUCCESS
                ? "Success!"
                : status === FAILED
                ? errorMessage
                : null}
            </Typography>
            <Button
              variant="contained"
              onClick={onClose}
              style={{
                backgroundColor: "#dc3545",
                width: "100%",
                marginTop: 10,
              }}>
              OK
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};
export default Loader;
