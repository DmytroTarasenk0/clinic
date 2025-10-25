const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Specialization = sequelize.define(
    "Specialization",
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "Specializations",
      indexes: [
        {
          unique: true,
          fields: ["name"],
        },
      ],
    }
  );

  Specialization.associate = (models) => {
    Specialization.hasMany(models.Doctor, {
      foreignKey: "specialization_id",
      onDelete: "SET NULL",
    });
  };

  return Specialization;
};
