import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white text-center py-2" style={{ marginTop: "auto" }}>
      © {new Date().getFullYear()} Expense Tracker | All Rights Reserved
    </footer>
  );
};

export default Footer;
