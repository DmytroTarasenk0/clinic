const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Sex = sequelize.define(
    "Sex",
    {
      sex_name: {
        type: DataTypes.CHAR(10),
        allowNull: false,
      },
    },
    {
      tableName: "Sex",
      indexes: [
        {
          unique: true,
          fields: ["sex_name"],
        },
      ],
    }
  );

  Sex.associate = (models) => {
    Sex.hasMany(models.Patient, {
      foreignKey: "sex_id",
      onDelete: "SET NULL",
    });
  };

  return Sex;
};
