import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CompleteAppointmentModal from "./CompleteAppointmentModal.jsx";

const DoctorAppointments = ({ onViewRecord }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completingAppointment, setCompletingAppointment] = useState(null);

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
    } catch (err) {
      console.error(err);
      setError("Can't fetch appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

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

  const handleCompleteClick = (appointment) =>
    setCompletingAppointment(appointment);

  const handleAppointmentCompleted = () => {
    setCompletingAppointment(null);
    fetchAppointments();
    alert("Appointment completed successfully.");
  };

  const handleViewRecordClick = (recordId) => {
    onViewRecord(recordId);
  };

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <h4>My Appointments</h4>
      {appointments.length === 0 ? (
        <p>You don't have appointments yet</p>
      ) : (
        <>
          <div className="doctor-grid">
            {currentAppointments.map((app) => (
              <div
                key={app.id}
                className={`doctor-card ${getStatusClass(app.status)}`}
              >
                <p>
                  <strong>Patient:</strong> {app.Patient?.first_name}{" "}
                  {app.Patient?.last_name}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(app.appointment_time).toLocaleString(undefined)}
                </p>
                {app.reason_for_visit && (
                  <p>
                    <strong>Reason of visit:</strong> {app.reason_for_visit}
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
                  {app.status === "scheduled" && (
                    <button
                      onClick={() => handleCompleteClick(app)}
                      className="button-success"
                    >
                      Complete
                    </button>
                  )}
                  {app.status === "completed" && (
                    <button
                      className="button-info"
                      onClick={() =>
                        handleViewRecordClick(app.MedicalRecord?.id)
                      }
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

      {completingAppointment && (
        <CompleteAppointmentModal
          appointment={completingAppointment}
          onClose={() => setCompletingAppointment(null)}
          onCompleted={handleAppointmentCompleted}
        />
      )}
    </div>
  );
};

export default DoctorAppointments;
