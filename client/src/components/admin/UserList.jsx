import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateDoctorModal from "./CreateDoctorModal.jsx";

const UserList = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [doctorsRes, patientsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/doctor"),
        axios.get("http://localhost:5000/api/patient"),
      ]);
      setDoctors(doctorsRes.data);
      setPatients(patientsRes.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load user lists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete user
  const handleDelete = async (id, name, role) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${role} "${name}"? This will delete their login account as well.`
      )
    ) {
      return;
    }

    try {
      // Determine endpoint based on role
      const endpoint =
        role === "doctor"
          ? `http://localhost:5000/api/doctor/${id}`
          : `http://localhost:5000/api/patient/${id}`;

      await axios.delete(endpoint);

      // Update local state without reloading everything
      if (role === "doctor") {
        setDoctors((prev) => prev.filter((doc) => doc.id !== id));
      } else {
        setPatients((prev) => prev.filter((pat) => pat.id !== id));
      }
    } catch (err) {
      console.error(`Error deleting ${role}:`, err);
      alert(`Failed to delete ${role}.`);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h3>Manage Users</h3>
      <button
        onClick={() => setShowCreateModal(true)}
        className="button-success"
      >
        Register New Doctor
      </button>

      {error && <p className="error-message">{error}</p>}

      {/* Doctors */}
      <h3>Doctors</h3>
      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <div className="doctor-grid">
          {doctors.map((doc) => (
            <div key={doc.id} className="doctor-card">
              <h4>
                {doc.first_name} {doc.last_name}
              </h4>
              <p>
                <strong>Role:</strong> Doctor
              </p>
              <p>
                <strong>Specialization</strong>: {doc.Specialization.name}
              </p>
              <button
                onClick={() =>
                  handleDelete(
                    doc.id,
                    `${doc.first_name} ${doc.last_name}`,
                    "doctor"
                  )
                }
                className="button-danger"
              >
                Delete an Account
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Patients */}
      <h3>Patients</h3>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div className="doctor-grid">
          {patients.map((pat) => (
            <div key={pat.id} className="doctor-card">
              <h4>
                {pat.first_name} {pat.last_name}
              </h4>
              <p>
                <strong>Role:</strong> Patient
              </p>
              <button
                onClick={() =>
                  handleDelete(
                    pat.id,
                    `${pat.first_name} ${pat.last_name}`,
                    "patient"
                  )
                }
                className="button-danger"
              >
                Delete an Account
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Doctor Modal */}
      {showCreateModal && (
        <CreateDoctorModal
          onClose={() => setShowCreateModal(false)}
          onDoctorCreated={fetchData}
        />
      )}
    </div>
  );
};

export default UserList;
