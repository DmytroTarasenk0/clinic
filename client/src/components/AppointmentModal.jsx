import React, { useState } from "react";
import axios from "axios";

// Form for booking an appointment with a doctor
const AppointmentModal = ({ doctor, onClose, onAppointmentBooked }) => {
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!appointmentTime) {
      setError("Date and time are required.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/appointment", {
        doctorId: doctor.id,
        appointment_time: appointmentTime,
        reason_for_visit: reason,
      });
      alert("Successfully booked an appointment.");
      onAppointmentBooked();
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Can't book an appointment due to a network error."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Doctor Appointment</h3>
        <p>
          <strong>Doctor:</strong> {doctor.first_name} {doctor.last_name}
        </p>
        <p>
          <strong>Specialization:</strong> {doctor.Specialization?.name}
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="appointmentTime">Date:</label>
            <input
              type="datetime-local"
              id="appointmentTime"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="reason">Reason of visit(optional):</label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-buttonGroup">
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Confirm Appointment"}
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

export default AppointmentModal;
