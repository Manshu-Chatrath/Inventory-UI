import { useState } from "react";
import AuthForm from "../components/authForm";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { login, defaultLoginStatus } from "../reducers/authSlice";
import Loader from "../components/loader";
import { useEffect } from "react";
import { FAILED, SUCCESS } from "../reducers/constant";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
    password: {
      label: "Password",
      name: "password",
      placeholder: "Enter your password",
      required: "Please enter your password!",
      type: "password",
    },
  };
  const errorMessage = useSelector((state) => state.auth.loginStatusError);
  const status = useSelector((state) => state.auth.loginStatus);
  useEffect(() => {
    if (status === FAILED || status === SUCCESS) {
      setLoading(false);
    }
    if (status === SUCCESS) {
      navigate("/", { replace: true });
    }
  }, [status]);

  const onSubmit = (data) => {
    setOpen(true);
    setLoading(true);
    dispatch(login(data));
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    return () => dispatch(defaultLoginStatus());
  }, []);

  return (
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
        onSubmit={onSubmit}
        errorMessage={errorMessage}
        form={form}
        handleSubmit={handleSubmit}
        errors={errors}
        register={register}
        buttonTitle={"Login"}
        type={"login"}
      />
    </>
  );
};

export default Login;
