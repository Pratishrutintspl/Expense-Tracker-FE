import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Home, Wallet, PieChart, FileText, Settings } from "lucide-react";
import { ThemeContext } from "../../../component/ThemeContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);

  const navItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    { name: "Expenses", icon: <Wallet size={18} />, path: "/expenses" },
    { name: "Budget", icon: <PieChart size={18} />, path: "/budget" },
    { name: "Categories", icon: <Settings size={18} />, path: "/category" },
    { name: "Reports", icon: <FileText size={18} />, path: "/reports" },
  ];

  return (
    <motion.aside
      className="sidebar d-flex flex-column p-3"
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        width: "230px",
        minHeight: "100vh",
        background: theme.gradient,
        position: "fixed",
        top: 0,
        left: 0,
        boxShadow: "0 0 20px rgba(0,0,0,0.25)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <h4
        className="text-center mb-4"
        style={{
          color: theme.text,
          fontWeight: "700",
          letterSpacing: "1px",
        }}
      >
        Expense Tracker
      </h4>

      {navItems.map((item, idx) => (
        <motion.a
          key={idx}
          href={item.path}
          className="nav-link d-flex align-items-center gap-3 mb-2 rounded-3"
          whileHover={{
            scale: 1.05,
            boxShadow: `0 0 15px ${theme.hover}`,
          }}
          style={{
            padding: "12px 16px",
            color: theme.text,
            textDecoration: "none",
            borderRadius: "10px",
            transition: "0.3s ease",
          }}
        >
          {item.icon}
          <span>{item.name}</span>
        </motion.a>
      ))}
    </motion.aside>
  );
};

export default Sidebar;
