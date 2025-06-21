module.exports = (sequelize, DataTypes) => {
  const Bebida = sequelize.define(
    "Bebida",
    {
      id_bebida: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      tipo_bebida: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      descripcion: {
        type: DataTypes.STRING(100),
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
      tableName: "crud_bebidas",
      timestamps: false
    }
  );

  return Bebida;
};
