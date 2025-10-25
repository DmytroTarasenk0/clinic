const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Symptom = sequelize.define(
    "Symptom",
    {
      symptom_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "Symptoms",
      indexes: [
        {
          unique: true,
          fields: ["symptom_name"],
        },
      ],
    }
  );

  Symptom.associate = (models) => {
    Symptom.belongsToMany(models.Diagnosis, {
      through: "DiagnosisSymptoms",
      foreignKey: "symptom_id",
      otherKey: "diagnosis_id",
      onDelete: "CASCADE",
    });
  };

  return Symptom;
};
