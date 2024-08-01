import { useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Category from "./pages/Category";
import { apiSlice } from "./reducers/apiSlice/apiSlice";
import Signup from "./pages/Signup";
import { isExpired } from "react-jwt";
import Dish from "./pages/Dish";
import ForgotPassword from "./pages/ForgotPassword";
import { useSelector } from "react-redux";
import Items from "./pages/Items";
import { Provider as Wrapper } from "react-redux";
import Main from "./pages/Main";
import { store } from "./reducers/index";
import Login from "./pages/Login";
import { useEffect } from "react";
function App() {
  const Routes = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const checkExpiry = () => {
      setInterval(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (isExpired(storedUser.token)) {
          localStorage.removeItem("user");
          setUser(null);
        }
      }, [60000]);
    };

    const loginStatus = useSelector((state) => state.auth.loginStatus);
    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && !isExpired(storedUser.token)) {
        setUser(storedUser);
        apiSlice.defaults.headers.common["Authorization"] = storedUser.token;
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
      if (loading) {
        setLoading(false);
      }
    }, [loginStatus]);

    useEffect(() => {
      if (!isExpired(user?.token)) {
        const intervalId = checkExpiry();
        return () => clearInterval(intervalId);
      }
    }, [user]);

    const router = createBrowserRouter(
      createRoutesFromElements(
        <>
          {user && !isExpired(user?.token) ? (
            <>
              <Route path="/" element={<Main />} />
              <Route path="/category" element={<Category />} />
              <Route path="/dish" element={<Dish />} />
              <Route path="/dish/:id" element={<Dish isEdit={true} />} />
              <Route path="/inventory" element={<Items />} />
              <Route path="*" element={<Main />} />
            </>
          ) : (
            <>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />{" "}
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="*" element={<Login />} />
            </>
          )}
        </>
      )
    );
    return loading ? <> </> : <RouterProvider router={router} />;
  };

  return (
    <Wrapper store={store}>
      <Routes />
    </Wrapper>
  );
}

export default App;
