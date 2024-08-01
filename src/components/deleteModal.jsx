import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SUCCESS, FAILED } from "../reducers/constant";
import Loader from "./loader";

const DeleteModal = ({
  open,
  setOpen,
  setSelectedItem,
  status,
  error,
  defaultFunction,
  handleDelete,
  description,
  warning = null,
}) => {
  const navigate = useNavigate();
  const onClose = () => {
    setSelectedItem(null);
    setOpen(false);
  };

  const [loading, setLoading] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);

  const dispatch = useDispatch();
  const onDelete = () => {
    setLoading(true);
    setOpenLoader(true);
    handleDelete();
  };

  useEffect(() => {
    if (status === SUCCESS || status === FAILED) {
      setLoading(false);
    }
    if (status === SUCCESS) {
      setSelectedItem(null);
    }
  }, [status]);

  const handleClose = () => {
    setOpenLoader(false);
    setLoading(false);
    setSelectedItem(null);
    if (status === SUCCESS) {
      setOpen(false);
      dispatch(defaultFunction());
    }
    if (description === "Dish") {
      navigate("/dishes", { replace: true });
    }
  };

  return (
    <>
      <Loader
        status={status}
        loading={loading}
        errorMessage={error}
        onClose={handleClose}
        open={openLoader}
      />
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {"Delete Confirmation"}
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this {description}?
          </DialogContentText>
          {warning ? (
            <DialogContentText
              style={{ color: "red" }}
              id="alert-dialog-description">
              Warning: {warning}!
            </DialogContentText>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteModal;
