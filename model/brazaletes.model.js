module.exports = (sequelize, DataTypes) => {
  const Brazalete = sequelize.define(
    "Brazalete",
    {
      id_brazalete: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      tipo_brazalete: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      precio: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: true
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: "brazaletes",
      timestamps: false
    }
  );

  return Brazalete;
};
