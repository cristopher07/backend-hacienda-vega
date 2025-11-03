module.exports = (sequelize, DataTypes) => {
  return sequelize.define('comanda', {
    id_comanda: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_mesa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_menu: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_bebidas: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    observacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    tipo_pago: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'comandas',
    timestamps: false
  });
};