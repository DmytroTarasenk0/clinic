const Router = require("express");
const router = new Router();
const medicalRecordController = require("../controllers/medicalRecordController");
const { authMiddleware, roleMiddleware } = require("../middleware/middleware");

const isAuth = authMiddleware;
const isAdmin = roleMiddleware("admin");

// Read by id
router.get("/:id", isAuth, medicalRecordController.getOne);

// Create diagnosis for medical record (admin)
router.post(
  "/:id/diagnosis",
  [isAuth, isAdmin],
  medicalRecordController.addDiagnosis
);

// Delete diagnosis from medical record (admin)
router.delete(
  "/:id/diagnosis/:diagnosisId",
  [isAuth, isAdmin],
  medicalRecordController.removeDiagnosis
);

module.exports = router;
