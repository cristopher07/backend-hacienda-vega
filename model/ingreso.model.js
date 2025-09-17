module.exports = (sequelize, DataTypes) => {
  const Ingreso = sequelize.define(
    "Ingreso",
    {
      id_ingreso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_area: { // Foreign key to Area
        type: DataTypes.INTEGER,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      metodo: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: "ingresos",
      timestamps: false
    }
  );

  return Ingreso;
};