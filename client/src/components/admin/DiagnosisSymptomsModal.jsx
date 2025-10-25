import React, { useState, useEffect } from "react";
import axios from "axios";

const DiagnosisSymptomsModal = ({ diagnosis, onClose, onSymptomsUpdated }) => {
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selectedSymptomIds, setSelectedSymptomIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [allSymptomsRes, currentSymptomsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/symptom"),
          axios.get(
            `http://localhost:5000/api/diagnosis/${diagnosis.id}/symptoms`
          ),
        ]);

        setAllSymptoms(allSymptomsRes.data);

        const currentIds = new Set(currentSymptomsRes.data.map((s) => s.id));
        setSelectedSymptomIds(currentIds);
      } catch (err) {
        console.error(err);
        setError("Can't load symptoms.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [diagnosis.id]);

  const handleCheckboxChange = (symptomId) => {
    setSelectedSymptomIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(symptomId)) {
        newSet.delete(symptomId);
      } else {
        newSet.add(symptomId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const symptomIdsArray = Array.from(selectedSymptomIds);

      await axios.put(
        `http://localhost:5000/api/diagnosis/${diagnosis.id}/symptoms`,
        {
          symptomIds: symptomIdsArray,
        }
      );

      onSymptomsUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error saving symptoms.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <h3>Update symptoms for: {diagnosis.name}</h3>

        {loading && <p>Loading...</p>}
        {error && <p className="modal-error">{error}</p>}

        {!loading && !error && (
          <div style={{ marginBottom: "1rem" }}>
            {allSymptoms.length === 0 ? (
              <p>No symptoms available...</p>
            ) : (
              allSymptoms.map((symptom) => (
                <div key={symptom.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`symptom-${symptom.id}`}
                    checked={selectedSymptomIds.has(symptom.id)}
                    onChange={() => handleCheckboxChange(symptom.id)}
                    style={{ marginRight: "0.5rem" }}
                  />
                  <label htmlFor={`symptom-${symptom.id}`}>
                    {symptom.symptom_name}
                  </label>
                </div>
              ))
            )}
          </div>
        )}

        <div className="modal-buttonGroup">
          <button onClick={handleSave} disabled={loading || saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={onClose} disabled={saving}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisSymptomsModal;
