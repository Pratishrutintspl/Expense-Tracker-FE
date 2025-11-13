import React, { useEffect, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../api/axiosInstance";
import { ThemeContext } from "../../ThemeContext";
import "./Header.css";

const Header = () => {
  const [userName, setUserName] = useState("User");
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const { theme, themeName, setThemeName } = useContext(ThemeContext);

  // Decode token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || "User");
      } catch {
        setUserName("User");
      }
    }
  }, []);

  // Fetch Profile
  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/auth/profile");
      setProfileData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const handleProfileClick = () => {
    fetchProfile();
    setShowProfile(true);
  };
  const handleClose = () => setShowProfile(false);

  // ✅ Theme Selection
  const themes = ["Night", "Sakura", "Ember"];
  const handleThemeSelect = (name) => {
    setThemeName(name);
    setShowThemeDropdown(false);
  };

  return (
    <>
      <motion.header
        className="d-flex align-items-center justify-content-between px-4 py-3 header-container"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          backgroundColor: theme.card,
          color: theme.text,
          borderBottom: `1px solid ${theme.hover}40`,
          boxShadow: `0 0 15px ${theme.hover}30`,
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* App Title */}
        <motion.h3
          className="fw-bold m-0"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          style={{
            color: theme.text,
            textShadow: `0 0 10px ${theme.hover}`,
          }}
        >
          Expense Tracker
        </motion.h3>

        {/* Right Section */}
        <div className="d-flex align-items-center gap-4 position-relative">
          {/* 🌈 Theme Dropdown */}
          <div className="position-relative">
            <button
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              className="btn btn-sm"
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${theme.hover}`,
                color: theme.text,
                borderRadius: "8px",
                padding: "6px 12px",
                width: "120px",
                transition: "0.3s",
              }}
            >
              {themeName === "Night"
                ? "🌙 Night"
                : themeName === "Sakura"
                ? "🌸 Sakura"
                : "🔥 Ember"}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showThemeDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "120%",
                    backgroundColor: theme.card,
                    borderRadius: "10px",
                    boxShadow: `0 0 15px ${theme.hover}40`,
                    padding: "10px",
                    border: `1px solid ${theme.hover}`,
                    zIndex: 2000,
                  }}
                >
                  {themes.map((t) => (
                    <motion.div
                      key={t}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: `${theme.hover}25`,
                      }}
                      onClick={() => handleThemeSelect(t)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: theme.text,
                        marginBottom: "4px",
                      }}
                    >
                      {t === "Night"
                        ? "🌙 Night"
                        : t === "Sakura"
                        ? "🌸 Sakura"
                        : "🔥 Ember"}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 👤 Profile Avatar */}
          <motion.div
            className="d-flex align-items-center gap-3 profile"
            onClick={handleProfileClick}
            style={{ cursor: "pointer", color: theme.text }}
            whileHover={{
              scale: 1.05,
              textShadow: `0 0 10px ${theme.hover}`,
            }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${userName}&background=0D8ABC&color=fff`}
              alt="avatar"
              className="rounded-circle"
              style={{ width: "38px", height: "38px" }}
            />
            <span>{userName}</span>
          </motion.div>
        </div>
      </motion.header>

      {/* 🧑‍💼 Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            className="profile-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
            onClick={handleClose}
          >
            <motion.div
              className="profile-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: theme.card,
                padding: "30px",
                borderRadius: "12px",
                width: "350px",
                color: theme.text,
                position: "relative",
                boxShadow: `0 0 20px ${theme.hover}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h5 className="mb-3">Profile Details</h5>
              {profileData ? (
                <div>
                  <p><strong>Name:</strong> {profileData.name}</p>
                  <p><strong>Email:</strong> {profileData.email}</p>
                  <p>
                    <strong>Joined:</strong>{" "}
                    {new Date(profileData.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    className="btn btn-outline-danger w-100 mt-3"
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/login";
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
