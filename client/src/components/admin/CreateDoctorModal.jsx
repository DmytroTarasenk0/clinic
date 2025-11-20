import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateDoctorModal = ({ onClose, onDoctorCreated }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    specializationId: "",
  });
  const [specializations, setSpecializations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load specializations for the dropdown
  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/specialization"
        );
        setSpecializations(response.data);
      } catch (err) {
        console.error("Error loading specializations:", err);
        setError("Failed to load specializations.");
      }
    };
    fetchSpecs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.specializationId) {
      setError("Please select a specialization.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/user/create-doctor", {
        ...formData,
        specializationId: parseInt(formData.specializationId, 10),
      });
      alert("Doctor account created successfully!");
      onDoctorCreated(); // Refresh the list
      onClose();
    } catch (err) {
      console.error("Creation error:", err);
      setError(
        err.response?.data?.message || "Failed to create doctor account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Register New Doctor</h3>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Login (Username):</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="specializationId">Specialization:</label>
            <select
              id="specializationId"
              name="specializationId"
              value={formData.specializationId}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              {specializations.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-buttonGroup">
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDoctorModal;
