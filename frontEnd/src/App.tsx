import { Fragment, useCallback, useContext, useEffect } from "react";
import Notification from "./components/notification/Notification";
import { createPortal } from "react-dom";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import NavBar from "./components/navBar/NavBar";
import AuthContext from "./store/AuthContext";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import ProtectedRoute from "./routes/ProtectedRoute";
import UserContext from "./store/UserContext";
import TaskList from "./pages/taskList/TaskList";

function App() {
  const { isLoggedIn } = useContext(AuthContext);
  const { getAllTasks, clearTask } = useContext(UserContext);

  const fetchAllTasks = useCallback(
    async function () {
      await getAllTasks();
    },
    [getAllTasks]
  );

  useEffect(() => {
    console.log("fetched tasks...........");
    if (isLoggedIn) {
      fetchAllTasks();
    } else {
      clearTask();
    }
  }, [isLoggedIn, fetchAllTasks, clearTask]);
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
        <Route
          path="/taskList"
          element={<ProtectedRoute>{<TaskList />}</ProtectedRoute>}
        />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Fragment>
  );
}

export default App;
