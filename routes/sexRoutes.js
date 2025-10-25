const Router = require("express");
const router = new Router();
const sexController = require("../controllers/sexController");

// Read all
router.get("/", sexController.getAll);

module.exports = router;
