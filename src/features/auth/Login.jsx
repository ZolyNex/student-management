import { useState } from "react";
import { login } from "../../services/apiAuth";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function onClick() {
    const data = await login(email, password);
    if (data) {
      navigate("/");
    }
  }
  return (
    <>
      <div className="w-full max-w-sm mx-auto shadow-2xl shadow-purple-300 rounded-box mt-20 p-6">
        <h1 className="text-center text-3xl mb-4">Sunshine</h1>

        <div className="w-full">
          <label className="input input-bordered flex items-center gap-2 my-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="input input-bordered flex items-center gap-2 my-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <div className="flex justify-between items-center text-sm my-3">
            <label>
              <input type="checkbox" className="checkbox checkbox-primary" />
              <span className="mx-1">Remember me</span>
            </label>

            <button className="btn btn-link">Forgotten password?</button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-3 text-center">
          <button
            className="btn btn-primary w-full md:w-auto"
            onClick={onClick}
          >
            Login
          </button>
          <button
            className="btn btn-secondary w-full md:w-auto"
            onClick={() => navigate("/signup")}
          >
            Signup
          </button>
        </div>
      </div>
    </>
  );
}
