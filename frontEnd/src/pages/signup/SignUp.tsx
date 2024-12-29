import { ChangeEvent, useContext, useState } from "react";
import AuthContext from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";
import { toastifyError } from "../../Helpers/notificationToastify";

interface SignUpCredentials {
  username: string;
  password: string;
  confirmPassword: string;
}

function SignUp() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpCredentials>({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      await authCtx.signUp({
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      navigate("/", { replace: true });
    } catch (error) {
      toastifyError((error as Error).message || "Internal Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          Sign Up
        </h2>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 font-semibold"
          >
            UserName
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-semibold"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-semibold"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
