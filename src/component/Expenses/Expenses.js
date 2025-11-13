import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    categoryId: "",
    date: "",
    description: "",
  });

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const res = await axiosInstance.get("/expense/allexpenses");
      setExpenses(res.data.data || []);
    } catch (err) {
      console.error(err);
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
    fetchExpenses();
    fetchCategories();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/expense/${editingId}`, formData);
        toast.success("Expense updated!");
      } else {
        await axiosInstance.post("/expense/add", formData);
        toast.success("Expense added!");
      }
      setFormData({
        title: "",
        amount: "",
        categoryId: "",
        date: "",
        description: "",
      });
      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error!");
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      title: exp.title,
      amount: exp.amount,
      categoryId: exp.categoryId,
      date: exp.date.slice(0, 10),
      description: exp.description,
    });
    setEditingId(exp._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await axiosInstance.patch(`/expense/${id}`);
        toast.success("Expense deleted!");
        fetchExpenses();
      } catch (err) {
        toast.error(err.response?.data?.message || "Error!");
      }
    }
  };

  return (
    <Box sx={{ marginLeft: "230px", p: 4, bgcolor: "#0f172a", minHeight: "100vh", color: "#fff" }}>
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: "#38bdf8" }}>
          💰 Manage Your Expenses
        </Typography>
      </motion.div>

      {/* Form Section */}
      <Card
        sx={{
          background: "linear-gradient(135deg, #1e293b, #111827)",
          color: "white",
          mb: 5,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <CardHeader
          title={editingId ? "✏️ Edit Expense" : "➕ Add New Expense"}
          sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#94a3b8" } }}
                  InputProps={{
                    style: { color: "white", borderColor: "#475569" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: "#94a3b8" } }}
                  InputProps={{
                    style: { color: "white", borderColor: "#475569" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: "#94a3b8" } }}
                  InputProps={{
                    style: { color: "white", borderColor: "#475569" },
                  }}
                >
                  <MenuItem value="">Select Category</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                    style: { color: "#94a3b8" },
                  }}
                  InputProps={{
                    style: { color: "white", borderColor: "#475569" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: "#94a3b8" } }}
                  InputProps={{
                    style: { color: "white", borderColor: "#475569" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    py: 1.2,
                    background: "linear-gradient(90deg, #2563eb, #38bdf8)",
                    fontWeight: "bold",
                  }}
                >
                  {editingId ? "Update Expense" : "Add Expense"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Grid container spacing={3}>
        {expenses.map((exp, index) => (
          <Grid item xs={12} sm={6} md={4} key={exp._id}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card
                sx={{
                  background:
                    index % 3 === 0
                      ? "linear-gradient(135deg, #2563eb, #1e3a8a)"
                      : index % 3 === 1
                      ? "linear-gradient(135deg, #16a34a, #065f46)"
                      : "linear-gradient(135deg, #f59e0b, #78350f)",
                  color: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {exp.title}
                  </Typography>
                  <Typography variant="body2">💵 Amount: ₹{exp.amount}</Typography>
                  <Typography variant="body2">
                    📂 Category: {exp.categoryId?.name || "Uncategorized"}
                  </Typography>
                  <Typography variant="body2">
                    📅 {new Date(exp.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    📝 {exp.description || "No description"}
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <IconButton color="warning" onClick={() => handleEdit(exp)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(exp._id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ExpensesPage;
