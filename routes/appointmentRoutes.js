const Router = require("express");
const router = new Router();
const appointmentController = require("../controllers/appointmentController");
const { authMiddleware, roleMiddleware } = require("../middleware/middleware");

const isAuth = authMiddleware;
const isPatient = roleMiddleware("patient");
const isAdmin = roleMiddleware("admin");

// Create(schedule) appointment for patient
router.post("/", [isAuth, isPatient], appointmentController.create);

// Read my appointments(any user)
router.get("/my", isAuth, appointmentController.getMy);

// Update(cancel) appointment by patient
router.patch(
  "/:id/cancel",
  [isAuth, isPatient],
  appointmentController.cancelByPatient
);

// Update(complete) appointment by doctor
router.post(
  "/:id/complete",
  [isAuth, isAdmin],
  appointmentController.completeByDoctor
);

module.exports = router;
