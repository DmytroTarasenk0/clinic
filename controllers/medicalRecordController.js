const {
  MedicalRecord,
  Appointment,
  Doctor,
  Specialization,
  Patient,
  RecordDiagnoses,
  Diagnosis,
  Medication,
} = require("../models/main.js");

class MedicalRecordController {
  // Read one by id
  async getOne(req, res) {
    try {
      const { id } = req.params;
      // get medical record all related data(appointment, doctor with specialization, patient, diagnoses with medications)
      const medicalRecord = await MedicalRecord.findByPk(id, {
        include: [
          {
            model: Appointment,
            attributes: ["appointment_time", "reason_for_visit"],
            required: false,
          },
          {
            model: Doctor,
            attributes: ["id", "first_name", "last_name"],
            required: false,
            include: [
              {
                model: Specialization,
                attributes: ["name"],
                required: false,
              },
            ],
          },
          {
            model: Patient,
            attributes: ["id", "first_name", "last_name"],
            required: false,
          },
          {
            model: RecordDiagnoses,
            attributes: ["id"],
            required: false,
            include: [
              {
                model: Diagnosis,
                attributes: ["id", "name"],
                required: false,
                include: [
                  {
                    model: Medication,
                    attributes: ["id", "name", "dosage", "frequency"],
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      });

      console.log(
        "Record data from DB:",
        JSON.stringify(medicalRecord, null, 2)
      );

      if (!medicalRecord) {
        console.log(`Medical Record with ID: ${id} not found.`);
        return res.status(404).json({ message: "Cant]'t find medical record" });
      }

      // Patient or Admin access check
      const userId = req.user.id;
      const userRole = req.user.role;
      let hasAccess = false;
      if (userRole === "patient") {
        const patient = await Patient.findOne({
          attributes: ["id"],
          where: { user_id: userId },
        });
        if (patient && medicalRecord.patient_id === patient.id) {
          hasAccess = true; // Patient can only access their own records
        }
      } else if (userRole === "doctor" || userRole === "admin") {
        hasAccess = true; // Admins and Doctors have access to all records
      }
      console.log(
        `User ID: ${userId}, Role: ${userRole}, Record Patient ID: ${medicalRecord.patient_id}, Has Access: ${hasAccess}`
      );
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Sructured response
      const responseData = {
        id: medicalRecord.id,
        summary: medicalRecord.summary,
        appointment_time: medicalRecord.Appointment?.appointment_time,
        reason_for_visit: medicalRecord.Appointment?.reason_for_visit,
        doctor: medicalRecord.Doctor,
        patient: medicalRecord.Patient,
        diagnoses: (medicalRecord.RecordDiagnoses || [])
          .map((rd) => {
            if (!rd.Diagnosis) return null;
            return {
              id: rd.Diagnosis.id,
              name: rd.Diagnosis.name,
              medications: rd.Diagnosis.Medications || [],
            };
          })
          .filter((d) => d !== null),
      };

      return res.json(responseData);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  }

  // Create a new diagnosis-record link
  async addDiagnosis(req, res) {
    try {
      const { id } = req.params;
      const { diagnosisId } = req.body;

      if (!diagnosisId) {
        return res.status(400).json({ message: "Diagnosis id is required" });
      }

      const record = await MedicalRecord.findByPk(id);
      const diagnosis = await Diagnosis.findByPk(diagnosisId);
      if (!record || !diagnosis) {
        return res
          .status(404)
          .json({ message: "Cant find record or diagnosis" });
      }

      const recordDiagnosis = await RecordDiagnoses.create({
        record_id: id,
        diagnosis_id: diagnosisId,
      });
      return res.status(201).json(recordDiagnosis);
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return res
          .status(409)
          .json({ message: "Diagnosis already added to this record" });
      }
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  }

  // Delete a diagnosis-record link
  async removeDiagnosis(req, res) {
    try {
      const { id, diagnosisId } = req.params;

      const deletedRows = await RecordDiagnoses.destroy({
        where: { record_id: id, diagnosis_id: diagnosisId },
      });
      if (deletedRows === 0) {
        return res
          .status(404)
          .json({ message: "Cant find diagnosis in this record" });
      }
      return res.json({
        message: "Diagnosis successfully removed from medical record",
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new MedicalRecordController();
