const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MedicalRecord = sequelize.define(
    "MedicalRecord",
    {
      summary: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "MedicalRecords",
      indexes: [
        {
          unique: true,
          fields: ["appointment_id"],
        },
      ],
    }
  );

  MedicalRecord.associate = (models) => {
    MedicalRecord.belongsTo(models.Appointment, {
      foreignKey: "appointment_id",
      onDelete: "CASCADE",
    });
    MedicalRecord.belongsTo(models.Patient, { foreignKey: "patient_id" });
    MedicalRecord.belongsTo(models.Doctor, { foreignKey: "doctor_id" });

    MedicalRecord.hasMany(models.RecordDiagnoses, {
      foreignKey: "record_id",
      onDelete: "CASCADE",
    });
  };

  return MedicalRecord;
};
