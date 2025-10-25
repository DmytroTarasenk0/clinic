const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Diagnosis = sequelize.define(
    "Diagnosis",
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "Diagnoses",
    }
  );

  Diagnosis.associate = (models) => {
    Diagnosis.hasMany(models.Medication, {
      foreignKey: "diagnosis_id",
      onDelete: "SET NULL",
    });
    Diagnosis.belongsToMany(models.Symptom, {
      through: "DiagnosisSymptoms",
      foreignKey: "diagnosis_id",
      otherKey: "symptom_id",
      onDelete: "CASCADE",
    });

    Diagnosis.hasMany(models.RecordDiagnoses, {
      foreignKey: "diagnosis_id",
      onDelete: "CASCADE",
    });
  };

  return Diagnosis;
};
