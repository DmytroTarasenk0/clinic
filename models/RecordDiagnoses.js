const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RecordDiagnoses = sequelize.define(
    "RecordDiagnoses",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: "RecordDiagnoses",
    }
  );

  RecordDiagnoses.associate = (models) => {
    RecordDiagnoses.belongsTo(models.MedicalRecord, {
      foreignKey: "record_id",
      onDelete: "CASCADE",
    });
    RecordDiagnoses.belongsTo(models.Diagnosis, {
      foreignKey: "diagnosis_id",
      onDelete: "CASCADE",
    });
  };

  return RecordDiagnoses;
};
