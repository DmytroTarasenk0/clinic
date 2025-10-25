const Router = require("express");
const router = new Router();
const diagnosisController = require("../controllers/diagnosisController");
const { authMiddleware, roleMiddleware } = require("../middleware/middleware");

const isAdmin = roleMiddleware("admin");
const isAuth = authMiddleware;

// Create a diagnosis (admin)
router.post("/", [isAuth, isAdmin], diagnosisController.create);

// Read all
router.get("/", isAuth, diagnosisController.getAll);

// Read one by id
router.get("/:id", isAuth, diagnosisController.getOne);

// Update by id (admin)
router.put("/:id", [isAuth, isAdmin], diagnosisController.update);

// Delete by id (admin)
router.delete("/:id", [isAuth, isAdmin], diagnosisController.delete);
router.get(
  "/:id/symptoms",
  isAuth,
  diagnosisController.getSymptomsForDiagnosis
);

// Update symptoms for a diagnosis by id (admin)
router.put(
  "/:id/symptoms",
  [isAuth, isAdmin],
  diagnosisController.updateSymptomsForDiagnosis
);

module.exports = router;
