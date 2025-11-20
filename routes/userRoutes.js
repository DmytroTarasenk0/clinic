const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const { authMiddleware, roleMiddleware } = require("../middleware/middleware");

// Create new user
router.post("/register", userController.register);

router.post("/create-doctor", 
    [authMiddleware, roleMiddleware("admin")], 
    userController.createDoctor);

// User login
router.post("/login", userController.login);

// User logout
router.post("/logout", userController.logout);

// Check authentication
router.get("/auth", authMiddleware, userController.checkAuth);

module.exports = router;
