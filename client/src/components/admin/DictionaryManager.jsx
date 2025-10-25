import React, { useState, useEffect } from "react";
import axios from "axios";
import DiagnosisSymptomsModal from "./DiagnosisSymptomsModal.jsx";

const DictionaryManager = ({ title, apiPath, fields }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);

  const [editingSymptomsFor, setEditingSymptomsFor] = useState(null);

  useEffect(() => {
    fetchItems();
    if (fields.some((field) => field.type === "select_diagnosis")) {
      fetchDiagnoses();
    }
  }, [apiPath, fields]);

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`http://localhost:5000${apiPath}`);
      setItems(response.data);
      resetForm();
    } catch (err) {
      console.error(err);
      setError("Can't load data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDiagnoses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/diagnosis");
      setDiagnoses(response.data);
    } catch (err) {
      console.error(err);
      setError("Can't load diagnoses");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    const initialData = {};
    fields.forEach((field) => {
      initialData[field.name] = item[field.name] || "";
    });
    if (apiPath === "/api/medication") {
      initialData["diagnosis_id"] = item.Diagnosis?.id || "";
    }
    setFormData(initialData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const dataToSend = { ...formData };
    if (dataToSend.diagnosis_id === "") {
      dataToSend.diagnosis_id = null;
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000${apiPath}/${editingId}`,
          dataToSend
        );
      } else {
        await axios.post(`http://localhost:5000${apiPath}`, dataToSend);
      }
      fetchItems();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Can't save data.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:5000${apiPath}/${id}`);
      fetchItems();
    } catch (err) {
      console.error(`Error deleting ${title}:`, err);
      setError(err.response?.data?.message || "Can't delete data.");
      setLoading(false);
    }
  };

  const handleEditSymptomsClick = (diagnosis) => {
    setEditingSymptomsFor(diagnosis);
  };

  return (
    <div>
      <h4>{title}</h4>
      {error && <p className="error-message">{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "1rem",
          border: "1px solid #ccc",
          padding: "1rem",
        }}
      >
        <h4>{editingId ? "Edit data" : "Add new data"}</h4>
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name}>{field.label}:</label>

            {field.type === "select_diagnosis" ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
              >
                <option value="">
                  No specific diagnosis (general medication)
                </option>
                {diagnoses.map((diag) => (
                  <option key={diag.id} value={diag.id}>
                    {diag.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || "text"}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                required={field.required !== false}
              />
            )}
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {editingId ? "Save" : "Add"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            style={{ marginLeft: "5px" }}
          >
            Cancel
          </button>
        )}
      </form>

      {loading && <p>Loading table...</p>}
      {!loading && items.length === 0 && <p>No records yet.</p>}
      {!loading && items.length > 0 && (
        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              {fields.map((field) => (
                <th key={field.name}>{field.label}</th>
              ))}
              {/* Diagnosis field(if medication) */}
              {apiPath === "/api/medication" && <th>Diagnosis </th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                {fields.map((field) => (
                  <td key={field.name}>{item[field.name]}</td>
                ))}

                {apiPath === "/api/medication" && (
                  <td>{item.Diagnosis?.name || "-"}</td>
                )}

                <td className="table-actions-cell">
                  <button
                    onClick={() => handleEditClick(item)}
                    disabled={loading}
                  >
                    Edit
                  </button>

                  {/* Symptoms button(if diagnosis) */}
                  {apiPath === "/api/diagnosis" && (
                    <button
                      onClick={() => handleEditSymptomsClick(item)}
                      disabled={loading}
                      style={{ marginLeft: "5px" }}
                    >
                      Symptoms
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="button-danger"
                    disabled={loading}
                    style={{ marginLeft: "5px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal window for checking symptoms */}
      {editingSymptomsFor && (
        <DiagnosisSymptomsModal
          diagnosis={editingSymptomsFor}
          onClose={() => setEditingSymptomsFor(null)}
          onSymptomsUpdated={() => {
            console.log("Symptoms updated");
          }}
        />
      )}
    </div>
  );
};

export default DictionaryManager;
