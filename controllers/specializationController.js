const { Specialization } = require("../models/main.js");
const { Sequelize } = require("sequelize");

class SpecializationController {
  // Create Specialization
  async create(req, res) {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res
          .status(400)
          .json({ message: "Can't create specialization without a name" });
      }

      const specialization = await Specialization.create({ name, description });
      return res.status(201).json(specialization);
    } catch (e) {
      if (e instanceof Sequelize.UniqueConstraintError) {
        return res
          .status(409)
          .json({ message: "Specialization name already exists" });
      }
      res.status(500).json({ message: e.message });
    }
  }

  // Read all
  async getAll(req, res) {
    try {
      const specializations = await Specialization.findAll();
      return res.json(specializations);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Read one by id
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const specialization = await Specialization.findByPk(id);
      if (!specialization) {
        return res.status(404).json({ message: "Can't find specialization" });
      }
      return res.json(specialization);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Update by id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const [updatedRows] = await Specialization.update(
        { name, description },
        { where: { id } }
      );

      if (updatedRows === 0) {
        return res.status(404).json({ message: "Can't find specialization" });
      }

      const updatedSpecialization = await Specialization.findByPk(id);
      return res.json(updatedSpecialization);
    } catch (e) {
      if (e instanceof Sequelize.UniqueConstraintError) {
        return res
          .status(409)
          .json({ message: "Specialization name already exists" });
      }
      res.status(500).json({ message: e.message });
    }
  }

  // Delete by id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedRows = await Specialization.destroy({ where: { id } });

      if (deletedRows === 0) {
        return res.status(404).json({ message: "Can't find specialization" });
      }

      return res.json({ message: "Specialization deleted successfully" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new SpecializationController();
