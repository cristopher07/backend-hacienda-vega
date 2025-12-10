module.exports = (sequelize, DataTypes) => {
  return sequelize.define("cierre_caja", {
    id_caja: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_area: DataTypes.INTEGER,
    fecha: DataTypes.DATEONLY,
    id_usuario: DataTypes.INTEGER,
    efectivo_caja: DataTypes.DECIMAL(10,2),
    restante: DataTypes.DECIMAL(10,2),
    observaciones: DataTypes.STRING,
    estado: {
      type: DataTypes.STRING,
      defaultValue: "CERRADO"
    }
  }, {
    tableName: "cierre_caja",
    timestamps: false
  });
};
