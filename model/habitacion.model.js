module.exports = (sequelize, DataTypes) => {
  const Habitacion = sequelize.define(
    "Habitacion",
    {
      id_habitacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      tipo_habitacion: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      numero_habitacion: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      huespedes: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      precio: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: "habitaciones",
      timestamps: false
    }
  );

  return Habitacion;
};
