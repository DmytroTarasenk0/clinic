const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Medication = sequelize.define(
    "Medication",
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      dosage: {
        type: DataTypes.STRING(100),
      },
      frequency: {
        type: DataTypes.STRING(100),
      },
    },
    {
      tableName: "Medications",
    }
  );

  Medication.associate = (models) => {
    Medication.belongsTo(models.Diagnosis, { foreignKey: "diagnosis_id" });
  };

  return Medication;
};
