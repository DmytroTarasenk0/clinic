require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const { sequelize, Sessions } = require("./models/main.js");
const mainRouter = require("./routes/main.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Cors for development on 2 different ports
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // Vite dev server
  })
);

// Middleware
app.use(express.json());

// Session Store
const mySessionStore = new SequelizeStore({
  db: sequelize,
  table: "Sessions",
  model: Sessions,
  checkExpirationInterval: 15 * 60 * 1000, // 15 min interval to check for expired sessions
  expiration: 24 * 60 * 60 * 1000, // 24 hours expiration
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "hardcoded_secret",
    store: mySessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// API Routes
app.use("/api", mainRouter);

// Client part
app.use(express.static(path.resolve(__dirname, "public")));

//  "Catch-All" route
// If request not from /api and not static => index.html
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// Server start
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
    await sequelize.sync({ alter: true });
    console.log("All models synchronized.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
};

start();
