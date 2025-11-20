import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const MyAppointments = ({ refreshTrigger, onRefreshed, onViewRecord }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/appointment/my"
      );
      setAppointments(response.data);
      if (onRefreshed) onRefreshed();
    } catch (err) {
      console.error(err);
      setError("Can't load appointments.");
    } finally {
      setLoading(false);
    }
  }, [onRefreshed]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments, refreshTrigger]);

  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.appointment_time) - new Date(a.appointment_time)
  );

  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = sortedAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;
    try {
      await axios.patch(
        `http://localhost:5000/api/appointment/${appointmentId}/cancel`
      );
      fetchAppointments();
      alert("Appointment cancelled successfully.");
    } catch (err) {
      console.error(err);
      alert(
        `Can't cancel appointment: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const handleViewRecordClick = (recordId) => {
    onViewRecord(recordId);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  // Get CSS class for card based on appointment status
  const getStatusClass = (status) => {
    switch (status) {
      case "scheduled":
        return "card-status-scheduled";
      case "completed":
        return "card-status-completed";
      case "cancelled":
        return "card-status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div>
      <h3>My Appointments</h3>
      {appointments.length === 0 ? (
        <p>You haven't booked appoint yet</p>
      ) : (
        <>
          <div className="doctor-grid">
            {currentAppointments.map((app) => (
              <div
                key={app.id}
                className={`doctor-card ${getStatusClass(app.status)}`}
              >
                <p>
                  <strong>Doctor:</strong> {app.Doctor?.first_name}{" "}
                  {app.Doctor?.last_name}
                  {app.Doctor?.Specialization?.name &&
                    ` (${app.Doctor.Specialization.name})`}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(app.appointment_time).toLocaleString(undefined)}
                </p>
                {app.reason_for_visit && (
                  <p>
                    <strong>Reason for visit:</strong> {app.reason_for_visit}
                  </p>
                )}
                <p>
                  <strong>Status:</strong> {app.status}
                </p>

                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    gap: "0.5rem",
                    paddingTop: "0.5rem",
                  }}
                >
                  {/* Patient can cancel only scheduled appointments */}
                  {user.role === "patient" && app.status === "scheduled" && (
                    <button
                      onClick={() => handleCancel(app.id)}
                      className="button-danger"
                    >
                      Cancel Appointment
                    </button>
                  )}
                  {/* View medical record for completed appointments */}
                  {app.status === "completed" && (
                    <button
                      onClick={() =>
                        handleViewRecordClick(app.MedicalRecord?.id)
                      }
                      className="button-info"
                      disabled={!app.MedicalRecord?.id}
                      title={
                        !app.MedicalRecord?.id
                          ? "Can't view record: No medical record available"
                          : ""
                      }
                    >
                      View Medical Record
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyAppointments;
