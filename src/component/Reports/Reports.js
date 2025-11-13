import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const Reports = () => {
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    axiosInstance.get("/reports/trends?year=2025").then((res) => {
        console.log(res)
      setTrends(res.data.data);
    });
  }, []);

  return (
    <div className="container mt-4">
      <h4>Expense Trends (2025)</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={trends}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="totalSpent" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Reports;
