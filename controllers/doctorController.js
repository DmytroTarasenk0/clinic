const { Doctor, User, Specialization } = require("../models/main.js");
const { sequelize } = require("../models/main.js");

class DoctorController {
  // Read all doctors with their specializations
  async getAll(req, res) {
    try {
      const doctors = await Doctor.findAll({
        include: [
          {
            model: Specialization,
            attributes: ["id", "name", "description"],
          },
        ],
        attributes: ["id", "first_name", "last_name"],
      });
      return res.json(doctors);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Read one doctor by ID with specialization
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const doctor = await Doctor.findByPk(id, {
        include: [
          {
            model: Specialization,
            attributes: ["id", "name", "description"],
          },
        ],
        attributes: ["id", "first_name", "last_name"],
      });

      if (!doctor) {
        return res.status(404).json({ message: "Can't find doctor" });
      }
      return res.json(doctor);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Update doctor details
  async update(req, res) {
    try {
      const { id } = req.params;
      const { firstName, lastName, specializationId } = req.body;

      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        return res.status(404).json({ message: "Can't find doctor" });
      }
      await doctor.update({
        first_name: firstName,
        last_name: lastName,
        specialization_id: specializationId,
      });
      return res.json(doctor);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Delete doctor and associated user account
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        return res.status(404).json({ message: "Can't find doctor" });
      }
      await User.destroy({ where: { id: doctor.user_id }, transaction: t });
      await t.commit();
      return res.json({
        message: "Doctor and associated user account successfully deleted",
      });
    } catch (e) {
      await t.rollback();
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new DoctorController();
