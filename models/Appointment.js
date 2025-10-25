const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Appointment = sequelize.define(
    "Appointment",
    {
      appointment_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(15),
        allowNull: false,
        validate: {
          isIn: [["scheduled", "completed", "cancelled"]],
        },
      },
      reason_for_visit: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "Appointments",
    }
  );

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.Patient, { foreignKey: "patient_id" });
    Appointment.belongsTo(models.Doctor, { foreignKey: "doctor_id" });
    Appointment.hasOne(models.MedicalRecord, {
      foreignKey: "appointment_id",
      onDelete: "CASCADE",
    });
  };

  return Appointment;
};
