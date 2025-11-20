import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import DoctorList from "./DoctorList.jsx";
import MyAppointments from "./MyAppointments.jsx";
import DoctorAppointments from "./admin/DoctorAppointments.jsx";
import DictionaryManager from "./admin/DictionaryManager.jsx";
import MedicalRecordView from "./MedicalRecordView.jsx";
import UserList from "./admin/UserList.jsx";

// Field configs for DictionaryManager
const specializationFields = [
  { name: "name", label: "Name", required: true },
  { name: "description", label: "Description", required: false },
];
const symptomFields = [
  { name: "symptom_name", label: "Name of symptom", required: true },
];
const diagnosisFields = [
  { name: "name", label: "Name", required: true },
  { name: "description", label: "Description", required: false },
];
const medicationFields = [
  { name: "name", label: "Name", required: true },
  { name: "description", label: "Description", required: false },
  { name: "dosage", label: "Dosage", required: false },
  { name: "frequency", label: "Frequency", required: false },
  {
    name: "diagnosis_id",
    label: "Diagnosis",
    type: "select_diagnosis",
    required: false,
  },
];

// Admin POV
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users"); // Tab

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return <UserList />;
      case "specializations":
        return (
          <DictionaryManager
            title="Specializations"
            apiPath="/api/specialization"
            fields={specializationFields}
          />
        );
      case "symptoms":
        return (
          <DictionaryManager
            title="Symptoms"
            apiPath="/api/symptom"
            fields={symptomFields}
          />
        );
      case "diagnoses":
        return (
          <DictionaryManager
            title="Diagnoses"
            apiPath="/api/diagnosis"
            fields={diagnosisFields}
          />
        );
      case "medications":
        return (
          <DictionaryManager
            title="Medications"
            apiPath="/api/medication"
            fields={medicationFields}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div>
      <h2>Admin Panel</h2>

      <nav
        style={{
          marginBottom: "1.5rem",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "0.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={() => setActiveTab("users")}
          disabled={activeTab === "users"}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("specializations")}
          disabled={activeTab === "specializations"}
        >
          Specializations
        </button>
        <button
          onClick={() => setActiveTab("symptoms")}
          disabled={activeTab === "symptoms"}
        >
          Symptoms
        </button>
        <button
          onClick={() => setActiveTab("diagnoses")}
          disabled={activeTab === "diagnoses"}
        >
          Diagnoses
        </button>
        <button
          onClick={() => setActiveTab("medications")}
          disabled={activeTab === "medications"}
        >
          Medications
        </button>
      </nav>
      <div>{renderTabContent()}</div>
    </div>
  );
};

// Doctor POV
const DoctorDashboard = ({ onViewRecord }) => {
  return (
    <div>
      <h2>Doctor's Panel</h2>
      <hr />
      <DoctorAppointments onViewRecord={onViewRecord} />
    </div>
  );
};

// Patient POV
const PatientDashboard = ({ onViewRecord }) => {
  const [refreshAppointments, setRefreshAppointments] = useState(false);

  const triggerAppointmentRefresh = () => {
    setRefreshAppointments((prev) => !prev);
  };

  return (
    <div>
      <h2>Patient's Panel</h2>
      <hr />
      <DoctorList onAppointmentCreated={triggerAppointmentRefresh} />
      <hr style={{ margin: "2rem 0" }} />
      <MyAppointments
        refreshTrigger={refreshAppointments}
        onRefreshed={() => console.log("List of appointments refreshed")}
        onViewRecord={onViewRecord}
      />
    </div>
  );
};

// Component for Medical Record
const Dashboard = () => {
  const { user } = useAuth();
  const [viewingRecordId, setViewingRecordId] = useState(null);

  const handleViewRecord = (recordId) => {
    if (recordId) {
      setViewingRecordId(recordId);
    } else {
      console.warn("Cannot view record: no record id provided.");
      alert("Cannot view record: no record id provided.");
    }
  };

  return (
    <div>
      {user.role === "admin" ? (
        <AdminDashboard />
      ) : user.role === "doctor" ? (
        <DoctorDashboard onViewRecord={handleViewRecord} />
      ) : (
        <PatientDashboard onViewRecord={handleViewRecord} />
      )}

      {viewingRecordId && (
        <MedicalRecordView
          recordId={viewingRecordId}
          onClose={() => setViewingRecordId(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
