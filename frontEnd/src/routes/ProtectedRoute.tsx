import { FC, ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../store/AuthContext";
import { toastifyWarning } from "../Helpers/notificationToastify";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    toastifyWarning("Not Authorized to access this Route.");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
