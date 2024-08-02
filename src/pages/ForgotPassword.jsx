import { useState } from "react";
import AuthForm from "../components/authForm";

import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import Otp from "../components/Otp";
import {
  forgotPassword,
  defaultVerifyOtpStatus,
  defaultForgotPasswordStatus,
  defaultNewPasswordStatus,
} from "../reducers/authSlice";
import Loader from "../components/loader";
import { useEffect } from "react";
import { SUCCESS, FAILED } from "../reducers/constant";
import { useNavigate } from "react-router-dom";
import NewPassword from "../components/newPassword";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const newPasswordStatus = useSelector(
    (state) => state.auth.newPasswordStatus
  );
  const newPasswordStatusError = useSelector(
    (state) => state.auth.newPasswordStatusError
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const otpStatus = useSelector((state) => state.auth.verifyOtpStatus);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const form = {
    email: {
      label: "Email",
      name: "email",
      placeholder: "Enter your email",
      required: "Please enter your email!",
      type: "email",
    },
  };
  const errorMessage = useSelector(
    (state) => state.auth.forgotPasswordStatusError
  );
  const verifyOtpStatusError = useSelector(
    (state) => state.auth.verifyOtpStatusError
  );
  const status = useSelector((state) => state.auth.forgotPasswordStatus);
  useEffect(() => {
    if (status === FAILED || status === SUCCESS) {
      setLoading(false);
    }
  }, [status]);

  const onSubmit = (data) => {
    setOpen(true);
    setLoading(true);
    setEmail(data.email);
    dispatch(forgotPassword(data));
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (newPasswordStatus === SUCCESS) {
      navigate("/login", { replace: true });
    }
  }, [newPasswordStatus]);

  useEffect(() => {
    return () => {
      dispatch(defaultForgotPasswordStatus());
      dispatch(defaultVerifyOtpStatus());
      dispatch(defaultNewPasswordStatus());
    };
  }, []);

  return (
    <>
      {otpStatus === SUCCESS ? (
        <NewPassword
          email={email}
          status={newPasswordStatus}
          errorMessage={newPasswordStatusError}
        />
      ) : status === SUCCESS ? (
        <Otp
          errorMessage={verifyOtpStatusError}
          page={"forgotPassword"}
          status={otpStatus}
          email={email}
        />
      ) : (
        <>
          <Loader
            status={status}
            loading={loading}
            type={"auth"}
            errorMessage={errorMessage}
            onClose={onClose}
            open={open}
          />
          <AuthForm
            title={"Forgot password"}
            onSubmit={onSubmit}
            errorMessage={errorMessage}
            form={form}
            handleSubmit={handleSubmit}
            errors={errors}
            register={register}
            buttonTitle={"Submit"}
          />
        </>
      )}
    </>
  );
};

export default ForgotPassword;
