const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Doctor = sequelize.define(
    "Doctor",
    {
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      tableName: "Doctors",
      indexes: [
        {
          unique: true,
          fields: ["user_id"],
        },
      ],
    }
  );

  Doctor.associate = (models) => {
    Doctor.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });

    Doctor.belongsTo(models.Specialization, {
      foreignKey: "specialization_id",
    });
    Doctor.hasMany(models.Appointment, {
      foreignKey: "doctor_id",
      onDelete: "NO ACTION",
    });
    Doctor.hasMany(models.MedicalRecord, {
      foreignKey: "doctor_id",
      onDelete: "NO ACTION",
    });
  };

  return Doctor;
};
