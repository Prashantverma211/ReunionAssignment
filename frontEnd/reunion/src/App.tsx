import { Fragment, useContext } from "react";
import Notification from "./components/notification/Notification";
import { createPortal } from "react-dom";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import NavBar from "./components/navBar/NavBar";
import AuthContext from "./store/AuthContext";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";

function App() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Fragment>
      {createPortal(
        <Notification />,
        document.getElementById("notification") as HTMLElement
      )}
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={isLoggedIn ? <HomePage /> : <Login />} />
        <Route
          path="/signUp"
          element={isLoggedIn ? <HomePage /> : <SignUp />}
        />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Fragment>
  );
}

export default App;
