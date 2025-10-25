const Router = require("express");
const router = new Router();
const doctorController = require("../controllers/doctorController");
const { authMiddleware, roleMiddleware } = require("../middleware/middleware");

const isAdmin = roleMiddleware("admin");

// Read all
router.get("/", doctorController.getAll);

// Read one by id
router.get("/:id", doctorController.getOne);

// Update doctor info (admin)
router.put("/:id", [authMiddleware, isAdmin], doctorController.update);

// Delete doctor (admin)
router.delete("/:id", [authMiddleware, isAdmin], doctorController.delete);

module.exports = router;
