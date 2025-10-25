const {
  Appointment,
  Patient,
  Doctor,
  Specialization,
  MedicalRecord,
  sequelize,
} = require("../models/main.js");

class AppointmentController {
  // Create Appointment
  async create(req, res) {
    try {
      const { doctorId, appointment_time, reason_for_visit } = req.body;
      const userId = req.user.id;
      const patient = await Patient.findOne({ where: { user_id: userId } });
      if (!patient) {
        return res.status(404).json({
          message: "Not found patient profile for the user",
        });
      }
      const appointment = await Appointment.create({
        patient_id: patient.id,
        doctor_id: doctorId,
        appointment_time,
        reason_for_visit,
        status: "scheduled",
      });
      return res.status(201).json(appointment);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  }

  // Read My Appointments
  async getMy(req, res) {
    try {
      const { id, role } = req.user;
      let whereClause = {}; // Filter
      let includeClause = [];

      const baseInclude = [
        {
          model: Doctor,
          attributes: ["id", "first_name", "last_name"],
          required: false,
          include: [
            { model: Specialization, attributes: ["name"], required: false },
          ],
        },
        {
          model: Patient,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "phone_number",
            "date_of_birth",
          ],
          required: false,
        },
        {
          model: MedicalRecord,
          attributes: ["id"],
          required: false,
        },
      ];

      // Patient or Doctor responce
      if (role === "patient") {
        const patient = await Patient.findOne({
          attributes: ["id"],
          where: { user_id: id },
        });
        if (!patient)
          return res
            .status(404)
            .json({ message: "Can't find patient profile" });
        whereClause = { patient_id: patient.id }; // Filter by patient ID
        includeClause = baseInclude.filter((inc) => inc.model !== Patient);
      } else if (role === "admin") {
        const doctor = await Doctor.findOne({
          attributes: ["id"],
          where: { user_id: id },
        });
        if (!doctor)
          return res.status(404).json({ message: "Can't find doctor profile" });
        whereClause = { doctor_id: doctor.id }; // Filter by doctor ID
        includeClause = baseInclude.filter((inc) => inc.model !== Doctor);
      } else {
        return res.status(403).json({ message: "Unknown role" });
      }

      // Retrieve appointments
      const appointments = await Appointment.findAll({
        where: whereClause,
        order: [["appointment_time", "DESC"]], // Sort by time
        include: includeClause,
      });

      console.log(
        `Found ${appointments.length} appointment(s) for user ${id} (role: ${role})`
      );
      return res.json(appointments);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  }

  // Update(Cancel) by Patient
  async cancelByPatient(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const patient = await Patient.findOne({
        attributes: ["id"],
        where: { user_id: userId },
      });
      const appointment = await Appointment.findByPk(id);

      if (!appointment) {
        return res.status(404).json({ message: "Can't find appointment" });
      }
      if (!patient || appointment.patient_id !== patient.id) {
        return res
          .status(403)
          .json({ message: "Wrong patient-profile for this appointment" });
      }
      if (appointment.status !== "scheduled") {
        return res.status(400).json({
          message: `Can't cancel appointment with status '${appointment.status}'`,
        });
      }

      await appointment.update({ status: "cancelled" });
      return res.json({ message: "Appointment cancelled successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  }

  // Update(Complete) by Doctor
  async completeByDoctor(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { summary } = req.body;
      const userId = req.user.id;

      if (!summary) {
        return res.status(400).json({
          message: "You must provide a summary for the medical record",
        });
      }

      const doctor = await Doctor.findOne({
        attributes: ["id"],
        where: { user_id: userId },
      });

      const appointment = await Appointment.findByPk(id, { transaction: t });

      if (!appointment) {
        await t.rollback();
        return res.status(404).json({ message: "Can't find appointment" });
      }
      if (!doctor || appointment.doctor_id !== doctor.id) {
        await t.rollback();
        return res.status(403).json({
          message: "Access denied: wrong doctor-profile for this appointment",
        });
      }
      if (appointment.status !== "scheduled") {
        await t.rollback();
        return res.status(400).json({
          message: `Can't complete appointment with status '${appointment.status}'`,
        });
      }

      // Update status and create MedicalRecord
      await appointment.update({ status: "completed" }, { transaction: t });

      const medicalRecord = await MedicalRecord.create(
        {
          appointment_id: appointment.id,
          patient_id: appointment.patient_id,
          doctor_id: doctor.id,
          summary: summary,
        },
        { transaction: t }
      );

      await t.commit();
      console.log(
        `Appointment with id ${id} completed. MedicalRecord with id ${medicalRecord.id} created.`
      );
      return res.status(201).json(medicalRecord); // Return created record
    } catch (e) {
      await t.rollback();
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new AppointmentController();
