module.exports = (sequelize, DataTypes) => {
  const Area = sequelize.define(
    "Area",
    {
      id_area: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: "areas",
      timestamps: false
    }
  );

  return Area;
};
