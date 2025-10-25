const Router = require("express");
const router = new Router();
const medicationController = require("../controllers/medicationController");
const { authMiddleware, roleMiddleware } = require("../middleware/middleware");

const isAdmin = roleMiddleware("admin");
const isAuth = authMiddleware;

// Create medication (admin)
router.post("/", [isAuth, isAdmin], medicationController.create);

// Read all medications
router.get("/", isAuth, medicationController.getAll);

// Read one by id
router.get("/:id", isAuth, medicationController.getOne);

// Update by id (admin)
router.put("/:id", [isAuth, isAdmin], medicationController.update);

// Delete by id (admin)
router.delete("/:id", [isAuth, isAdmin], medicationController.delete);

module.exports = router;
