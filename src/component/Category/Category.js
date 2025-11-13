import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.patch(`/categories/${editingId}`, formData);
        toast.success("Category updated!");
      } else {
        await axiosInstance.post("/categories", formData);
        toast.success("Category added!");
      }
      setFormData({ name: "" });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = (cat) => {
    setFormData({ name: cat.name });
    setEditingId(cat._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this category?")) {
      try {
        await axiosInstance.patch(`/categories/${id}/delete`);
        toast.success("Category deleted!");
        fetchCategories();
      } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div
      style={{
        marginLeft: "228px",
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#fff",
      }}
    >
      <ToastContainer />
      <h4 className="fw-bold mb-4">🏷️ Categories</h4>

      {/* Form */}
      <div
        className="card p-4 mb-5 rounded-4 shadow-lg"
        style={{ background: "#1e293b" }}
      >
        <h5 className="mb-3">{editingId ? "Edit Category" : "Add Category"}</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-8">
            <input
              type="text"
              name="name"
              placeholder="Category Name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <button type="submit" className="btn btn-primary w-100">
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="row g-4">
        {categories.map((cat, index) => (
          <motion.div
            key={cat._id}
            className="col-md-4 col-sm-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="card shadow-lg p-4 rounded-4"
              style={{
                background:
                  index % 3 === 0
                    ? "linear-gradient(135deg, #2563eb, #1e3a8a)"
                    : index % 3 === 1
                    ? "linear-gradient(135deg, #16a34a, #065f46)"
                    : "linear-gradient(135deg, #f59e0b, #78350f)",
                color: "#fff",
              }}
            >
              <h6 className="mb-2">{cat.name}</h6>
              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleEdit(cat)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(cat._id)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Category;
