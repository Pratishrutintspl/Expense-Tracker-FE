import { useEffect, useState, useContext } from "react";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import { ThemeContext } from "../../component/ThemeContext";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const res = await axiosInstance.get(
          `/reports/summary?month=${month}&year=${year}`
        );
        setSummary(res.data.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    fetchSummary();
  }, []);

  if (!summary) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          minHeight: "calc(100vh - 100px)",
          paddingLeft: "240px",
          color: theme.text,
          transition: "color 0.5s ease",
        }}
      >
        <div className="spinner-border text-light" role="status"></div>
        <p className="mt-3 opacity-75">Loading summary...</p>
      </div>
    );
  }

  const summaryEntries = Object.entries(summary);

  // 🎨 Define theme-based card colors
  const cardColors = {
    Night: ["#1e293b", "#334155", "#475569", "#64748b"],
    Sakura: ["#ffd6e0", "#ffe3ec", "#f8bbd0", "#ffb6c1"],
    Ember: ["#ff8c42", "#ff7043", "#ff9f68", "#ff6f3c"],
  };

  const cardPalette = cardColors[theme.name] || cardColors.Night;

  return (
    <div
      style={{
        marginLeft: "240px",
        padding: "30px",
        minHeight: "100vh",
        color: theme.text,
        fontFamily: "'Poppins', sans-serif",
        transition: "color 0.5s ease",
      }}
    >
    <motion.h4
  className="fw-bold mb-5"
  style={{
    color: theme.hover, // use highlight color for the heading
    transition: "color 0.3s ease",
   // borderBottom: `3px solid ${theme.hover}`,
    display: "inline-block",
    paddingBottom: "4px",
    letterSpacing: "0.5px",
  }}
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Dashboard Summary
</motion.h4>



      <div className="row g-4">
        {summaryEntries.map(([key, value], index) => {
          const bgColor = cardPalette[index % cardPalette.length];
          return (
            <motion.div
              key={key}
              className="col-xl-3 col-lg-4 col-md-6"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 25px ${theme.hover}`,
                }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-4 position-relative"
                style={{
                  borderRadius: "16px",
                  backgroundColor: bgColor,
                  border: `1px solid ${theme.hover}`,
                  boxShadow: `0 0 10px ${theme.hover}40`,
                  color: theme.text,
                  transition: "all 0.3s ease",
                }}
              >
                <div className="d-flex flex-column">
                  <h6
                    className="text-uppercase mb-2"
                    style={{
                      fontSize: "13px",
                      letterSpacing: "0.5px",
                      color: theme.text,
                      opacity: 0.8,
                    }}
                  >
                    {key.replace(/([A-Z])/g, " $1")}
                  </h6>
                  <h2
                    className="fw-bold"
                    style={{
                      fontSize: "2rem",
                      color: theme.text,
                      textShadow: `0 0 6px ${theme.hover}`,
                    }}
                  >
                    {value}
                  </h2>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
