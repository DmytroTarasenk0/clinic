const Router = require("express");
const router = new Router();
const medicalRecordController = require("../controllers/medicalRecordController");
const { authMiddleware, roleMiddleware } = require("../middleware/middleware");

const isAuth = authMiddleware;
const isDoctor = roleMiddleware("doctor");

// Read by id
router.get("/:id", isAuth, medicalRecordController.getOne);

// Create diagnosis for medical record (doctor)
router.post(
  "/:id/diagnosis",
  [isAuth, isDoctor],
  medicalRecordController.addDiagnosis
);

// Delete diagnosis from medical record (doctor)
router.delete(
  "/:id/diagnosis/:diagnosisId",
  [isAuth, isDoctor],
  medicalRecordController.removeDiagnosis
);

module.exports = router;
