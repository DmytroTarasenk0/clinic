const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Patient = sequelize.define(
    "Patient",
    {
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    },
    {
      tableName: "Patients",
      indexes: [
        {
          unique: true,
          fields: ["user_id"],
        },
      ],
    }
  );

  Patient.associate = (models) => {
    Patient.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });

    Patient.belongsTo(models.Sex, { foreignKey: "sex_id" });
    Patient.hasMany(models.Appointment, {
      foreignKey: "patient_id",
      onDelete: "NO ACTION",
    });
    Patient.hasMany(models.MedicalRecord, {
      foreignKey: "patient_id",
      onDelete: "NO ACTION",
    });
  };

  return Patient;
};
