import { useState } from "react";
import AuthForm from "../components/authForm";
import { useForm } from "react-hook-form";
import { newPassword } from "../reducers/authSlice";
import { useDispatch } from "react-redux";

import Loader from "../components/loader";
const NewPassword = ({ errorMessage, status, email }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const form = {
    password: {
      label: "Password",
      name: "password",
      placeholder: "Enter your password",
      required: "Please enter your password!",
      type: "password",
      rules: {
        required: "Password is required!",
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters!",
        },
        pattern: {
          value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
          message:
            "Password must have at least one uppercase letter, one number, and one special character!",
        },
      },
    },
    confirmPassword: {
      label: "Confirm Password",
      type: "password",
      name: "confirmPassword",
      placeholder: "Confirm password",
      required: "Please confirm your password!",
      validate: (value) => {
        return value === watch("password") || "The password does not match";
      },
    },
  };

  const onSubmit = (data) => {
    data.email = email;
    setLoading(true);
    setOpen(true);
    dispatch(newPassword(data));
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Loader
        status={status}
        type={"auth"}
        loading={loading}
        errorMessage={errorMessage}
        onClose={onClose}
        open={open}
      />
      <AuthForm
        title={"New Password"}
        onSubmit={onSubmit}
        errorMessage={errorMessage}
        form={form}
        handleSubmit={handleSubmit}
        errors={errors}
        register={register}
        buttonTitle={"Submit"}
      />
    </>
  );
};

export default NewPassword;
