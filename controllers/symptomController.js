const { Symptom, Sequelize } = require("../models/main.js");

class SymptomController {
  // Create Symptom
  async create(req, res) {
    try {
      const { symptom_name } = req.body;
      if (!symptom_name) {
        return res
          .status(400)
          .json({ message: "Can't create symptom without a name" });
      }
      const symptom = await Symptom.create({ symptom_name });
      return res.status(201).json(symptom);
    } catch (e) {
      if (e instanceof Sequelize.UniqueConstraintError) {
        return res.status(409).json({ message: "Symptom name already exists" });
      }
      res.status(500).json({ message: e.message });
    }
  }

  // Read all
  async getAll(req, res) {
    try {
      const symptoms = await Symptom.findAll();
      return res.json(symptoms);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Read one by id
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const symptom = await Symptom.findByPk(id);
      if (!symptom) {
        return res.status(404).json({ message: "Can't find symptom" });
      }
      return res.json(symptom);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Update by id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { symptom_name } = req.body;

      const [updatedRows] = await Symptom.update(
        { symptom_name },
        { where: { id } }
      );

      if (updatedRows === 0) {
        return res.status(404).json({ message: "Can't find symptom" });
      }

      const updatedSymptom = await Symptom.findByPk(id);
      return res.json(updatedSymptom);
    } catch (e) {
      if (e instanceof Sequelize.UniqueConstraintError) {
        return res.status(409).json({ message: "Symptom name already exists" });
      }
      res.status(500).json({ message: e.message });
    }
  }

  // Delete by id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedRows = await Symptom.destroy({ where: { id } });

      if (deletedRows === 0) {
        return res.status(404).json({ message: "Can't find symptom" });
      }
      return res.json({ message: "Symptom deleted successfully" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new SymptomController();
