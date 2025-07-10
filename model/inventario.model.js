module.exports = (sequelize, DataTypes) => {
  const Inventario = sequelize.define(
    "Inventario",
    {
      id_inventario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      producto: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      categoria: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      costo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      precio_vta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      estado: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_area: { // Foreign key to Area
        type: DataTypes.INTEGER,
        allowNull: false
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: "inventarios",
      timestamps: false
    }
  );

  return Inventario;
};
