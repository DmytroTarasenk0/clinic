const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          isIn: [["patient", "admin"]],
        },
      },
    },
    {
      tableName: "Users",
      indexes: [
        {
          unique: true,
          fields: ["username"],
        },
      ],
    }
  );

  User.associate = (models) => {
    User.hasOne(models.Patient, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
    User.hasOne(models.Doctor, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
  };

  return User;
};
