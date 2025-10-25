import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const MedicalRecordView = ({ recordId, onClose }) => {
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [allDiagnoses, setAllDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecordData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const recordRes = await axios.get(
        `http://localhost:5000/api/record/${recordId}`
      );
      setRecord(recordRes.data);

      // Give a doctor the ability to add diagnoses
      if (user?.role === "admin") {
        const diagnosesRes = await axios.get(
          "http://localhost:5000/api/diagnosis"
        );
        setAllDiagnoses(diagnosesRes.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Can't load medical record.");
    } finally {
      setLoading(false);
    }
  }, [recordId, user?.role]);

  useEffect(() => {
    if (recordId) {
      fetchRecordData();
    } else {
      setError("No record ID provided.");
      setLoading(false);
    }
  }, [fetchRecordData, recordId]);

  const handleAddDiagnosis = async (diagnosisId) => {
    if (!diagnosisId) return;

    if (!record || !record.diagnoses) {
      alert("Error occurred: medical record data is not fully loaded yet.");
      return;
    }

    if (record.diagnoses.some((d) => d.id === parseInt(diagnosisId, 10))) {
      alert("Diagnosis already added to this record.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/record/${record.id}/diagnosis`,
        { diagnosisId }
      );
      fetchRecordData();
    } catch (err) {
      console.error(err);
      alert(
        `Can't add diagnosis: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const handleRemoveDiagnosis = async (diagnosisId) => {
    if (
      !record ||
      !window.confirm("Are you sure you want to remove this diagnosis?")
    )
      return;
    try {
      await axios.delete(
        `http://localhost:5000/api/record/${record.id}/diagnosis/${diagnosisId}`
      );
      fetchRecordData();
    } catch (err) {
      console.error(err);
      alert(
        `Can't remove diagnosis: ${err.response?.data?.message || err.message}`
      );
    }
  };

  if (loading)
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>Loading...</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content">
          <p className="error-message">{error}</p>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );

  if (!record) return null;

  // Render possible diagnoses to add (exclude already added)
  const addedDiagnosisIds = new Set((record.diagnoses || []).map((d) => d.id));
  const availableDiagnoses = allDiagnoses.filter(
    (d) => !addedDiagnosisIds.has(d.id)
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <h3>
          Medical Record (From Date:{" "}
          {record.appointment_time
            ? new Date(record.appointment_time).toLocaleDateString(undefined)
            : "N/A"}
          )
        </h3>

        <p>
          <strong>Doctor:</strong>{" "}
          {record.doctor
            ? `${record.doctor.first_name} ${record.doctor.last_name}`
            : "N/A"}{" "}
          {record.doctor?.Specialization?.name
            ? `(${record.doctor.Specialization.name})`
            : ""}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {record.appointment_time
            ? new Date(record.appointment_time).toLocaleString(undefined)
            : "N/A"}
        </p>
        {record.reason_for_visit && (
          <p>
            <strong>Reason for visit:</strong> {record.reason_for_visit}
          </p>
        )}

        <h4>Doctor summary:</h4>
        <p
          style={{
            whiteSpace: "pre-wrap",
            background: "#f0f0f0",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          {record.summary}
        </p>

        <hr style={{ margin: "1.5rem 0" }} />

        <h4>Diagnoses and recommended medication:</h4>
        {(record.diagnoses || []).length === 0 ? (
          <p>No diagnoses yet.</p>
        ) : (
          (record.diagnoses || []).map((diag) => (
            <div
              key={diag.id}
              style={{
                border: "1px solid #eee",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <strong>{diag.name}</strong>
                {/* Delete button for doctor */}
                {user?.role === "admin" && (
                  <button
                    onClick={() => handleRemoveDiagnosis(diag.id)}
                    className="button-danger"
                    style={{
                      padding: "0.2em 0.5em",
                      fontSize: "0.8em",
                      marginLeft: "10px",
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>

              {(diag.medications || []).length > 0 ? (
                <ul
                  style={{
                    fontSize: "0.9em",
                    marginTop: "0",
                    paddingLeft: "20px",
                    listStyle: "disc",
                  }}
                >
                  {(diag.medications || []).map((med) => (
                    <li key={med.id}>
                      {med.name} {`(${med.dosage}, ${med.frequency})`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  style={{
                    fontSize: "0.9em",
                    fontStyle: "italic",
                    margin: "5px 0 0 20px",
                  }}
                >
                  No medications recommended.
                </p>
              )}
            </div>
          ))
        )}

        {/* Doctor section to add a diagnosis */}
        {user?.role === "admin" && (
          <div
            style={{
              marginTop: "1.5rem",
              borderTop: "1px solid #ccc",
              paddingTop: "1rem",
            }}
          >
            <h4>Add diagnosis:</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <select
                onChange={(e) => handleAddDiagnosis(e.target.value)}
                defaultValue=""
                style={{ flexGrow: 1 }}
              >
                <option value="" disabled>
                  Select diagnosis
                </option>
                {availableDiagnoses.map((diag) => (
                  <option key={diag.id} value={diag.id}>
                    {diag.name}
                  </option>
                ))}
                {availableDiagnoses.length === 0 && allDiagnoses.length > 0 && (
                  <option disabled>All diagnoses added</option>
                )}
                {allDiagnoses.length === 0 && (
                  <option disabled>No diagnoses in Dictionary</option>
                )}
              </select>
            </div>
          </div>
        )}

        <div
          className="modal-buttonGroup"
          style={{ justifyContent: "center", marginTop: "2rem" }}
        >
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordView;
