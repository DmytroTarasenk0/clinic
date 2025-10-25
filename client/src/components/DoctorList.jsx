import React, { useState, useEffect } from "react";
import axios from "axios";
import AppointmentModal from "./AppointmentModal.jsx";

const DoctorList = ({ onAppointmentCreated }) => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecId, setSelectedSpecId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch data
  useEffect(() => {
    const fetchDoctorsAndSpecs = async () => {
      setLoading(true);
      setError("");
      try {
        const [docsRes, specsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/doctor"),
          axios.get("http://localhost:5000/api/specialization"),
        ]);
        setDoctors(docsRes.data);
        setSpecializations(specsRes.data);
      } catch (err) {
        console.error(err);
        setError("Can't load doctors or specializations.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorsAndSpecs();
  }, []);

  // Filter doctors based on selected specialization
  const filteredDoctors = selectedSpecId
    ? doctors.filter(
        (doctor) => doctor.Specialization?.id === parseInt(selectedSpecId, 10)
      )
    : doctors; // Full list if no filter

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Set page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSpecId]);

  const handleBookClick = (doctor) => setSelectedDoctor(doctor);

  const handleAppointmentBooked = () => {
    console.log("Appointment booked callback in DoctorList.");
    if (onAppointmentCreated) {
      onAppointmentCreated();
    }
    setSelectedDoctor(null);
  };

  if (loading) return <p>Doctors loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <h3>Find a Doctor</h3>

      <div>
        <label htmlFor="specFilter">Filter by Specialization: </label>
        <select
          id="specFilter"
          value={selectedSpecId}
          onChange={(e) => setSelectedSpecId(e.target.value)}
        >
          <option value="">All Specializations</option>
          {specializations.map((spec) => (
            <option key={spec.id} value={spec.id}>
              {spec.name}
            </option>
          ))}
        </select>
      </div>
      <hr />

      {filteredDoctors.length === 0 ? (
        <p>No Doctors with this Specialization</p>
      ) : (
        <div className="doctor-grid">
          {currentDoctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <h4>
                {doctor.first_name} {doctor.last_name}
              </h4>
              <p>Specialization: {doctor.Specialization.name}</p>
              <button onClick={() => handleBookClick(doctor)}>
                Book an Appointment
              </button>
            </div>
          ))}
        </div>
      )}

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

      {selectedDoctor && (
        <AppointmentModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onAppointmentBooked={handleAppointmentBooked}
        />
      )}
    </div>
  );
};

export default DoctorList;
