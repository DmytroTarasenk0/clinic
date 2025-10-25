const { Medication, Diagnosis } = require("../models/main.js");

class MedicationController {
  // Create Medication
  async create(req, res) {
    try {
      const { diagnosis_id, name, description, dosage, frequency } = req.body;
      if (!name) {
        return res
          .status(400)
          .json({ message: "Can't create medication without name" });
      }

      const medication = await Medication.create({
        diagnosis_id: diagnosis_id || null, // null for general medications
        name,
        description,
        dosage,
        frequency,
      });
      return res.status(201).json(medication);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Read all
  async getAll(req, res) {
    try {
      const medications = await Medication.findAll({
        include: [
          {
            model: Diagnosis,
            attributes: ["name"],
          },
        ],
      });
      return res.json(medications);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Read one by id
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const medication = await Medication.findByPk(id, {
        include: [
          {
            model: Diagnosis,
            attributes: ["name"],
          },
        ],
      });

      if (!medication) {
        return res.status(404).json({ message: "Can't find medication" });
      }
      return res.json(medication);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Update by id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { diagnosis_id, name, description, dosage, frequency } = req.body;

      const [updatedRows] = await Medication.update(
        {
          diagnosis_id: diagnosis_id || null,
          name,
          description,
          dosage,
          frequency,
        },
        { where: { id } }
      );

      if (updatedRows === 0) {
        return res.status(404).json({ message: "Can't find medication" });
      }

      const updatedMedication = await Medication.findByPk(id);
      return res.json(updatedMedication);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  // Delete by id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedRows = await Medication.destroy({ where: { id } });

      if (deletedRows === 0) {
        return res.status(404).json({ message: "Can't find medication" });
      }
      return res.json({ message: "Medication successfully deleted" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new MedicationController();
