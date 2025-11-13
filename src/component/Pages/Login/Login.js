import React, { useState, useContext } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { AuthContext } from "../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CryptoJS from "crypto-js";
const Login = () => {
  const { login } = useContext(AuthContext);
  const [step, setStep] = useState(1); // 1 = verify email, 2 = enter password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // STEP 1: Verify email
  const handleEmailCheck = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/check-email", { email });
      const data = res.data;

      if (data.success && data.data?.exists) {
        toast.success("Email verified! Please enter your password.");
        setStep(2); // move to next step
      } else {
        toast.error("This email is not registered. Please sign up first.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

const SECRET_KEY = "EXPENSE_TRACKER_SECRET"; // 🔒 move to .env later



  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning("Please enter your email.");
      return;
    }
    if (!password) {
      toast.warning("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // 🔐 Encrypt password before sending
      const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();

      const res = await axiosInstance.post("/auth/login", {
        email,
        password: encryptedPassword,
      });

      const data = res.data;

      if (data.success && data.data?.token) {
        login(data.data.token);
        toast.success("Login successful!");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else if (data.message === "Incorrect password") {
        toast.error("Incorrect password. Try again.");
      } else if (data.message === "Email ID not registered") {
        toast.error("This email is not registered.");
      } else {
        toast.error("Login failed.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <ToastContainer />
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">
          {step === 1 ? "Verify Email" : "Enter Password"}
        </h3>

        {step === 1 ? (
          <form onSubmit={handleEmailCheck}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Checking..." : "Next"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                disabled
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              className="btn btn-link w-100 mt-2"
              onClick={() => setStep(1)}
            >
              Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
