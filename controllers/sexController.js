const { Sex } = require("../models/main.js");

class SexController {
  // Read all
  async getAll(req, res) {
    try {
      const sexes = await Sex.findAll();
      return res.json(sexes);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new SexController();
