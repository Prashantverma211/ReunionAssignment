import { useContext } from "react";
import AuthContext from "../../store/AuthContext";

function HomePage() {
  const { isLoggedIn, username } = useContext(AuthContext);

  return (
    <div className="text-center mt-4">
      <h1 className="text-3xl font-bold  py-2 px-4 rounded-md">
        {isLoggedIn ? `Welcome, ${username}!` : "Welcome, Guest!"}
      </h1>

      <div className="my-6">
        <h2 className="text-xl font-semibold text-green-500">
          ReUnion Assignment
        </h2>
        <p className="text-gray-700">Task Management System</p>
      </div>
    </div>
  );
}

export default HomePage;
