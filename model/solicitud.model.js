module.exports = (sequelize, DataTypes) => {
  const Solicitud = sequelize.define(
    "Solicitud",
    {
      id_solicitud: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      fecha_solicitud: {
        type: DataTypes.DATE,
        allowNull: false
      },
      id_usuario: { // Foreign key to Usuario
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_area: { // Foreign key to Area
        type: DataTypes.INTEGER,
        allowNull: false
      },
      detalle: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      documento: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      estado: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      fecha_revision: {
        type: DataTypes.DATE,
        allowNull: true
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: "solicitudes",
      timestamps: false
    }
  );

  return Solicitud;
};
