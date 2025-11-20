const { Patient, User, Appointment } = require("../models/main.js");
const { sequelize } = require("../models/main.js");

class PatientController {
  // Read all patients
  async getAll(req, res) {
    try {
      const patients = await Patient.findAll({
        include: [
          {
            model: User,
            attributes: ["username", "role", "id"],
          },
        ],
        attributes: [
          "id",
          "first_name",
          "last_name",
          "phone_number",
          "date_of_birth",
          "sex_id",
        ],
      });
      return res.json(patients);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Read one patient by id
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const patient = await Patient.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ["username", "role"],
          },
        ],
      });

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      return res.json(patient);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Delete patient and associated user account
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const patient = await Patient.findByPk(id);

      if (!patient) {
        await t.rollback();
        return res.status(404).json({ message: "Patient not found" });
      }

      await Appointment.destroy({ where: { patient_id: id }, transaction: t });
      await User.destroy({ where: { id: patient.user_id }, transaction: t });

      await t.commit();
      return res.json({
        message: "Patient and user account deleted successfully",
      });
    } catch (e) {
      await t.rollback();
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new PatientController();
