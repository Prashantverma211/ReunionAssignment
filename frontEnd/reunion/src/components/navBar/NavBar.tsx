import { useContext } from "react";
import AuthContext from "../../store/AuthContext";
import { toastifySuccess } from "../../Helpers/notificationToastify";
import { Link, NavLink, useNavigate } from "react-router-dom";
import UserContext from "../../store/UserContext";

function NavBar() {
  const authCtx = useContext(AuthContext);
  const { clearTask } = useContext(UserContext);
  const navigate = useNavigate();

  function LogoutHandler() {
    authCtx.logout();
    clearTask();
    navigate("/", { replace: true });
    toastifySuccess("Logged out successfully.");
  }
  return (
    <header className="flex flex-row justify-between items-center gap-3 p-2 bg-green-500 text-white font-medium text-base mb-5">
      <Link className=" cursor-pointer" to="/">
        ReUnion
      </Link>
      <div className="flex flex-row justify-between gap-5">
        <NavLink
          className={`${({ isActive }: { isActive: boolean }) =>
            isActive ? "active" : ""} cursor-pointer`}
          to="/"
          end
        >
          {authCtx.isLoggedIn ? "Dashboard Page" : "HomePage"}
        </NavLink>
        {authCtx.isLoggedIn && (
          <NavLink
            className={`${({ isActive }: { isActive: boolean }) =>
              isActive ? "active" : ""} cursor-pointer`}
            to="/taskList"
            end
            replace
          >
            Task List
          </NavLink>
        )}
      </div>
      <div className="flex flex-row gap-5 items-center">
        {!authCtx.isLoggedIn && (
          <Link className=" cursor-pointer" to="/login" replace>
            Login
          </Link>
        )}

        {!authCtx.isLoggedIn && (
          <Link
            className="cursor-pointer px-2 py-2 bg-blue-700 rounded-md hover:bg-blue-500 "
            to="/signUp"
            replace
          >
            SignUp
          </Link>
        )}

        {authCtx.isLoggedIn && (
          <button
            className="cursor-pointer px-2 py-2 bg-blue-700 rounded-md hover:bg-blue-500 "
            onClick={LogoutHandler}
          >
            Log Out
          </button>
        )}
      </div>
    </header>
  );
}

export default NavBar;
