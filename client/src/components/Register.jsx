import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "patient",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    sexId: "",
    specializationId: "",
  });
  const [message, setMessage] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const [sexes, setSexes] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sexRes, specRes] = await Promise.all([
          axios.get("http://localhost:5000/api/sex"),
          axios.get("http://localhost:5000/api/specialization"),
        ]);
        setSexes(sexRes.data);
        setSpecializations(specRes.data);
      } catch (err) {
        console.error(err);
        setMessage("Can't load registration data.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !formData.username ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    let userData = {
      username: formData.username,
      password: formData.password,
      role: formData.role,
      firstName: formData.firstName,
      lastName: formData.lastName,
    };

    if (formData.role === "patient") {
      if (!formData.dateOfBirth || !formData.sexId) {
        setMessage("Date of Birth and Sex are required for patients.");
        return;
      }
      userData = {
        ...userData,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        sexId: parseInt(formData.sexId, 10),
      };
    } else if (formData.role === "admin") {
      if (!formData.specializationId) {
        setMessage("Specialization is required for admins.");
        return;
      }
      userData = {
        ...userData,
        specializationId: parseInt(formData.specializationId, 10),
      };
    }

    try {
      await register(userData);
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div>
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="patient">Patient</option>
            <option value="admin">Doctor</option>
          </select>
        </div>
        {/* fields dependent on role */}
        {formData.role === "patient" && (
          <>
            <div>
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Sex:</label>
              <select
                name="sexId"
                value={formData.sexId}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {sexes.map((sex) => (
                  <option key={sex.id} value={sex.id}>
                    {sex.sex_name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        {formData.role === "admin" && (
          <div>
            <label>Specialization:</label>
            <select
              name="specializationId"
              value={formData.specializationId}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              {specializations.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit">Register</button>
      </form>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <p>
        Already have an <Link to="/login">account?</Link>
      </p>
    </div>
  );
};

export default Register;
