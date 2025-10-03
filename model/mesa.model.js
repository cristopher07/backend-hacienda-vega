module.exports = (sequelize, DataTypes) => {
  const Mesa = sequelize.define(
    "Mesa",
    {
      id_mesa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      tipo_de_mesa: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      estado: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Disponible'
      }
    },
    {
      tableName: "crud_mesas",
      timestamps: false
    }
  );

  return Mesa;
};
