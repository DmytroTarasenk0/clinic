const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "mssql",
  host: process.env.DB_SERVER,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
  logging: false,
  define: {
    timestamps: false,
    freezeTableName: true,
  },
});

const models = {
  User: require("./User")(sequelize),
  Sex: require("./Sex")(sequelize),
  Patient: require("./Patient")(sequelize),
  Specialization: require("./Specialization")(sequelize),
  Doctor: require("./Doctor")(sequelize),
  Symptom: require("./Symptom")(sequelize),
  Diagnosis: require("./Diagnosis")(sequelize),
  Medication: require("./Medication")(sequelize),
  Appointment: require("./Appointment")(sequelize),
  MedicalRecord: require("./MedicalRecord")(sequelize),
  RecordDiagnoses: require("./RecordDiagnoses")(sequelize),
  Sessions: require("./Sessions")(sequelize),
};

Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

module.exports = { ...models, sequelize };
