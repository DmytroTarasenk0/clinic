const Router = require("express");
const router = new Router();

const userRouter = require("./userRoutes");
const specializationRouter = require("./specializationRoutes");
const doctorRouter = require("./doctorRoutes");
const appointmentRouter = require("./appointmentRoutes");
const diagnosisRouter = require("./diagnosisRoutes");
const symptomRouter = require("./symptomRoutes");
const medicationRouter = require("./medicationRoutes");
const medicalRecordRouter = require("./medicalRecordRoutes");
const sexRouter = require("./sexRoutes");
const patientRouter = require("./patientRoutes");

router.use("/user", userRouter);
router.use("/specialization", specializationRouter);
router.use("/doctor", doctorRouter);
router.use("/appointment", appointmentRouter);
router.use("/diagnosis", diagnosisRouter);
router.use("/symptom", symptomRouter);
router.use("/medication", medicationRouter);
router.use("/record", medicalRecordRouter);
router.use("/sex", sexRouter);
router.use("/patient", patientRouter);

module.exports = router;
