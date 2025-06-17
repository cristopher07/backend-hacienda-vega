module.exports = (sequelize, DataTypes) => {
  const Menu = sequelize.define(
    "Menu",
    {
      id_menu: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      tipo_menu: {
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
      tableName: "crud_menu",
      timestamps: false
    }
  );

  return Menu;
};
