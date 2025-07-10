module.exports = (sequelize, DataTypes) => {
  const Usuarios = sequelize.define(
    "Usuarios",
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      usuario: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      rol: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      id_area: { // Foreign key to Area
        type: DataTypes.INTEGER,
        allowNull: false
      },
      estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
    },
    {
      tableName: "usuarios",
      timestamps: false
    }
  );

  return Usuarios;
};
