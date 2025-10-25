const Router = require("express");
const router = new Router();
const symptomController = require("../controllers/symptomController");
const { authMiddleware, roleMiddleware } = require("../middleware/middleware");

const isAdmin = roleMiddleware("admin");
const isAuth = authMiddleware;

// Create (admin)
router.post("/", [isAuth, isAdmin], symptomController.create);

// Read all
router.get("/", isAuth, symptomController.getAll);

// Read one by id
router.get("/:id", isAuth, symptomController.getOne);

// Update by id (admin)
router.put("/:id", [isAuth, isAdmin], symptomController.update);

// Delete by id (admin)
router.delete("/:id", [isAuth, isAdmin], symptomController.delete);

module.exports = router;
