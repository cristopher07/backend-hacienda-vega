const db = require("../config/db");

exports.getDashboardResumen = async () => {
  const query = `
    SELECT
  -- INGRESOS HOTEL
  (
    SELECT IFNULL(SUM(i.monto), 0)
    FROM ingresos i
    INNER JOIN areas a ON a.id_area = i.id_area
    WHERE a.nombre = 'Hotel'
  ) AS ingreso_hotel,

  -- INGRESOS PISCINA
  (
    SELECT IFNULL(SUM(i.monto), 0)
    FROM ingresos i
    INNER JOIN areas a ON a.id_area = i.id_area
    WHERE a.nombre = 'Piscina'
  ) AS ingreso_piscina,

  -- INGRESOS RESTAURANTE (COMANDAS)
  (
    SELECT IFNULL(SUM(c.subtotal), 0)
    FROM comandas c
  ) AS ingreso_restaurante,

  -- TOTAL INGRESOS
  (
    (
      SELECT IFNULL(SUM(i.monto), 0)
      FROM ingresos i
    )
    +
    (
      SELECT IFNULL(SUM(c.subtotal), 0)
      FROM comandas c
    )
  ) AS total_ingresos,

  -- TOTAL EGRESOS (SOLICITUDES APROBADAS)
  (
    SELECT IFNULL(SUM(s.monto), 0)
    FROM solicitudes s
    WHERE s.estado = 'Aprobada'
  ) AS total_egresos;

  `;

  const [data] = await db.query(query, {
    type: db.Sequelize.QueryTypes.SELECT
  });

  const totalIngresos = Number(data.total_ingresos || 0);
  const totalEgresos = Number(data.total_egresos || 0);

  return {
    success: true,
    data: {
      ingresoHotel: Number(data.ingreso_hotel || 0),
      ingresoPiscina: Number(data.ingreso_piscina || 0),
      ingresoRestaurante: Number(data.ingreso_restaurante || 0),
      totalIngresos,
      totalEgresos,
      balance: totalIngresos - totalEgresos
    }
  };
};
