const {
  Diagnosis,
  Symptom,
  Sequelize,
  sequelize,
} = require("../models/main.js");

class DiagnosisController {
  // Create diagnosis
  async create(req, res) {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res
          .status(400)
          .json({ message: "Can't create diagnosis without a name" });
      }
      const diagnosis = await Diagnosis.create({ name, description });
      return res.status(201).json(diagnosis);
    } catch (e) {
      if (e instanceof Sequelize.UniqueConstraintError) {
        return res
          .status(409)
          .json({ message: "This diagnosis already exists" });
      }
      res.status(500).json({ message: e.message });
    }
  }

  // Read all
  async getAll(req, res) {
    try {
      const diagnoses = await Diagnosis.findAll();
      return res.json(diagnoses);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Read one by id
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const diagnosis = await Diagnosis.findByPk(id);
      if (!diagnosis) {
        return res.status(404).json({ message: "Can't find diagnosis" });
      }
      return res.json(diagnosis);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Update by id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const [updatedRows] = await Diagnosis.update(
        { name, description },
        { where: { id } }
      );

      if (updatedRows === 0) {
        return res.status(404).json({ message: "Can't find diagnosis" });
      }

      const updatedDiagnosis = await Diagnosis.findByPk(id);
      return res.json(updatedDiagnosis);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Delete by id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedRows = await Diagnosis.destroy({ where: { id } });

      if (deletedRows === 0) {
        return res.status(404).json({ message: "Can't find diagnosis" });
      }
      return res.json({ message: "Diagnosis deleted successfully" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Read symptoms for a diagnosis
  async getSymptomsForDiagnosis(req, res) {
    try {
      const { id } = req.params;
      const diagnosis = await Diagnosis.findByPk(id, {
        // Include related symptoms
        include: [
          {
            model: Symptom,
            attributes: ["id", "symptom_name"],
            through: { attributes: [] },
          },
        ],
      });

      if (!diagnosis) {
        return res.status(404).json({ message: "Can't find diagnosis" });
      }

      return res.json(diagnosis.Symptoms || []); // Created automatically
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Update symptoms for a diagnosis
  async updateSymptomsForDiagnosis(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { symptomIds } = req.body;

      if (!Array.isArray(symptomIds)) {
        return res
          .status(400)
          .json({ message: "Request body must contain symptomIds array" });
      }

      const diagnosis = await Diagnosis.findByPk(id, { transaction: t });
      if (!diagnosis) {
        await t.rollback();
        return res.status(404).json({ message: "Can't find diagnosis" });
      }

      await diagnosis.setSymptoms(symptomIds, { transaction: t });

      const updatedSymptoms = await diagnosis.getSymptoms({
        attributes: ["id", "symptom_name"],
        transaction: t,
      });

      await t.commit();

      return res.json(updatedSymptoms);
    } catch (e) {
      await t.rollback();
      console.error(e);
      res.status(500).json({
        message: e.message,
      });
    }
  }
}

module.exports = new DiagnosisController();
