// model of Sessions(express-session) for not losing sessions after server update

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Sessions = sequelize.define(
    "Sessions",
    {
      sid: {
        type: DataTypes.STRING(36), // ID
        primaryKey: true,
      },
      expires: {
        type: DataTypes.DATE,
      },
      data: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "Sessions",
      timestamps: true,
    }
  );

  return Sessions;
};
