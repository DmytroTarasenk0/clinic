const bcrypt = require("bcryptjs");
const { User, Patient, Doctor } = require("../models/main.js");
require("dotenv").config();

class UserController {
  // Create User(registration)
  async register(req, res) {
    try {
      const {
        username,
        password,
        role,
        firstName,
        lastName,
        dateOfBirth,
        phone,
        sexId,
        specializationId,
      } = req.body;

      if (!username || !password || !role || !firstName || !lastName) {
        return res
          .status(400)
          .json({ message: "Registration data is incomplete" });
      }

      const candidate = await User.findOne({ where: { username } });
      if (candidate) {
        return res
          .status(409)
          .json({ message: "User with this username already exists" });
      }

      const hashPassword = await bcrypt.hash(password, 5);

      const user = await User.create({
        username,
        password_hash: hashPassword,
        role,
      });

      // Patient or Doctor profile creation
      if (role === "patient") {
        if (!dateOfBirth) {
          return res
            .status(400)
            .json({ message: "Can't register patient without date of birth" });
        }
        await Patient.create({
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          phone_number: phone,
          sex_id: sexId,
        });
      } else if (role === "admin") {
        if (!specializationId) {
          return res
            .status(400)
            .json({ message: "Can't register doctor without specialization" });
        }
        await Doctor.create({
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          specialization_id: specializationId,
        });
      }

      // Create session for the new user
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      return res.status(201).json(req.session.user);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  }

  // Login User
  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ message: "Can't find user" });
      }

      const isPassValid = bcrypt.compareSync(password, user.password_hash);
      if (!isPassValid) {
        return res.status(400).json({ message: "Invalid password" });
      }

      // Create session
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      return res.json(req.session.user);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  }

  // Check session
  async checkAuth(req, res) {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Session data
    return res.json(req.session.user);
  }

  // Logout User(break session)
  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Can't logout" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  }
}

module.exports = new UserController();
