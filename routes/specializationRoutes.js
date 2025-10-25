const Router = require("express");
const router = new Router();
const specializationController = require("../controllers/specializationController");
const { roleMiddleware } = require("../middleware/middleware");

const isAdmin = roleMiddleware("admin");

// Create specialization (admin)
router.post("/", isAdmin, specializationController.create);

// Read all
router.get("/", specializationController.getAll);

// Read one by id
router.get("/:id", specializationController.getOne);

// Update by id (admin)
router.put("/:id", isAdmin, specializationController.update);

// Delete by id (admin)
router.delete("/:id", isAdmin, specializationController.delete);

module.exports = router;
