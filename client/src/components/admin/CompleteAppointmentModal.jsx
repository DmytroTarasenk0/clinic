import React, { useState } from "react";
import axios from "axios";

const CompleteAppointmentModal = ({ appointment, onClose, onCompleted }) => {
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!summary.trim()) {
      setError("Summary is required.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/appointment/${appointment.id}/complete`,
        {
          summary: summary,
        }
      );
      onCompleted();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error completing appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Completing appointment</h3>
        <p>
          <strong>Patient:</strong> {appointment.Patient.first_name}{" "}
          {appointment.Patient.last_name}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(appointment.appointment_time).toLocaleString(undefined)}
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="summary">Summary:</label>
            <input
              type="text"
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-buttonGroup">
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Complete Appointment"}
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

export default CompleteAppointmentModal;
