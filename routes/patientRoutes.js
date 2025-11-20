const Router = require("express");
const router = new Router();
const patientController = require("../controllers/patientController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/middleware.js");

const isAuth = authMiddleware;
const isAdmin = roleMiddleware("admin");

// Get all patients
router.get("/", isAuth, patientController.getAll);

// Get one patient
router.get("/:id", isAuth, patientController.getOne);

// Delete patient (admin)
router.delete("/:id", [isAuth, isAdmin], patientController.delete);

module.exports = router;
