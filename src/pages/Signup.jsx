import { useEffect, useState } from "react";
import AuthForm from "../components/authForm";
import { useForm } from "react-hook-form";
import Otp from "../components/Otp";
import { useSelector, useDispatch } from "react-redux";
import { SUCCESS, FAILED } from "../reducers/constant";
import {
  initiateSignUp,
  defaultInitiateSignupStatus,
  defaultFinalSignupStatus,
} from "../reducers/authSlice";
import Loader from "../components/loader";
const Signup = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.initiateSignUpStatus);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const errorMessage = useSelector(
    (state) => state.auth.initiateSignUpStatusError
  );
  const errorMessage2 = useSelector(
    (state) => state.auth.finalSignUpStatusError
  );
  const otpStatus = useSelector((state) => state.auth.finalSignUpStatus);
  useEffect(() => {
    return () => {
      dispatch(defaultInitiateSignupStatus());
      dispatch(defaultFinalSignupStatus());
    };
  }, []);
  const {
    register,
    handleSubmit,
    watch,
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

  useEffect(() => {
    if (status === FAILED || status === SUCCESS) {
      setLoading(false);
    }
  }, [status]);

  const onSubmit = (data) => {
    setLoading(true);
    setOpen(true);
    setEmail(data.email);
    dispatch(initiateSignUp(data));
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      {status === SUCCESS ? (
        <Otp
          errorMessage={errorMessage2}
          page={"signup"}
          status={otpStatus}
          email={email}
        />
      ) : (
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
            title={"Sign Up"}
            errorMessage={errorMessage}
            loading={loading}
            onSubmit={onSubmit}
            form={form}
            handleSubmit={handleSubmit}
            errors={errors}
            register={register}
            buttonTitle={"Sign Up"}
            type={"signup"}
          />
        </>
      )}
    </>
  );
};

export default Signup;
