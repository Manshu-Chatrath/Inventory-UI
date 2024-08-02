import { useState, useEffect } from "react";
import AuthForm from "../components/authForm";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { finalSignUp, verifyOtp } from "../reducers/authSlice";
import Loader from "../components/loader";
import { FAILED } from "../reducers/constant";
import { SUCCESS } from "../reducers/constant";
const Otp = ({ email, page, status, errorMessage }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (status === SUCCESS || status === FAILED) {
      setLoading(false);
    }
    if (status === SUCCESS) {
      if (page === "signup") {
        navigate("/login", { replace: true });
      }
    }
  }, [status]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const form = {
    otp: {
      label: "OTP",
      name: "otp",
      placeholder: "Enter your otp",
      required: "Please enter your otp!",
      type: "number",
      validate: {
        notLessThanZero: (value) =>
          parseInt(value, 10) >= 0 || "Value cannot be less than 0", // Custom rule to ensure value is not less than 0
      },
    },
  };

  const onSubmit = (data) => {
    data.email = email;
    setLoading(true);
    setOpen(true);
    if (page === "signup") {
      dispatch(finalSignUp(data));
    }
    if (page === "forgotPassword") {
      dispatch(verifyOtp(data));
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Loader
        status={status}
        errorMessage={"Some error occured!"}
        loading={loading}
        open={open}
        onClose={onClose}
      />
      <AuthForm
        title={"OTP"}
        errorMessage={errorMessage}
        onSubmit={onSubmit}
        form={form}
        handleSubmit={handleSubmit}
        errors={errors}
        register={register}
        buttonTitle={"Submit"}
      />
    </>
  );
};

export default Otp;
