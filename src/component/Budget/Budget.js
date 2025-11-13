import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    period: "monthly",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [categories, setCategories] = useState([]);

  // Fetch budgets
  const fetchBudgets = async () => {
    try {
      const res = await axiosInstance.get("/budget");
      setBudgets(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch budgets");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mandatory validation
      if (!formData.category || !formData.amount || !formData.period || !formData.month || !formData.year) {
        toast.error("All fields are required!");
        return;
      }

      await axiosInstance.post("/budget", formData);
      toast.success("Budget added!");
      setFormData({
        category: "",
        amount: "",
        period: "monthly",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      fetchBudgets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding budget");
    }
  };

  return (
    <div style={{ marginLeft: "228px", padding: "20px", minHeight: "100vh", backgroundColor: "#0f172a", color: "#fff" }}>
      <ToastContainer />
      <h4 className="fw-bold mb-4">💰 Budget</h4>

      {/* Form */}
      <div className="card p-4 mb-5 rounded-4 shadow-lg" style={{ background: "#1e293b" }}>
        <h5 className="mb-3">Add Budget</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <input type="number" name="amount" placeholder="Amount" className="form-control" value={formData.amount} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <select name="period" className="form-select" value={formData.period} onChange={handleChange} required>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="col-md-2">
            <input type="number" name="month" placeholder="Month (1-12)" className="form-control" value={formData.month} onChange={handleChange} min="1" max="12" required />
          </div>
          <div className="col-md-2">
            <input type="number" name="year" placeholder="Year" className="form-control" value={formData.year} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">Add Budget</button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="row g-4">
        {budgets.map((budget, index) => (
          <motion.div key={budget._id} className="col-md-4 col-sm-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <motion.div whileHover={{ scale: 1.05 }} className="card shadow-lg p-4 rounded-4" style={{
              background:
                index % 3 === 0
                  ? "linear-gradient(135deg, #2563eb, #1e3a8a)"
                  : index % 3 === 1
                  ? "linear-gradient(135deg, #16a34a, #065f46)"
                  : "linear-gradient(135deg, #f59e0b, #78350f)",
              color: "#fff",
            }}>
              <h6 className="mb-1">{budget.title}</h6>
              <p className="mb-1">Amount: {budget.amount}</p>
              <p className="mb-1">Category: {budget.category?.name || budget.category}</p>
              <p className="mb-1">Period: {budget.period}</p>
              <p className="mb-1">Month: {budget.month}, Year: {budget.year}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BudgetPage;
