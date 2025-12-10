const db = require("../config/db");
const CierreModel = require("../model/cierre.model");
const CierreCaja = CierreModel(db, db.Sequelize);
const { sendEmail } = require('../utils/email');

exports.getResumenCaja = async ({ fecha, id_usuario, rol }) => {
  let query = "";
  let replacements = { fecha };

  // RECEPCIONISTA → INGRESOS
  if (rol === "recepcionista") {
    query = `
      SELECT 
        SUM(CASE WHEN metodo = 'Efectivo' THEN monto ELSE 0 END) AS efectivo,
        SUM(CASE WHEN metodo = 'Transferencia' THEN monto ELSE 0 END) AS transferencia,
        SUM(CASE WHEN metodo IN ('Débito', 'Crédito') THEN monto ELSE 0 END) AS tarjeta
      FROM ingresos
      WHERE DATE(fecha) = :fecha
    `;
    replacements.id_usuario = id_usuario;
  }

  // CAJERA → COMANDAS
  if (rol === "cajera") {
    query = `
      SELECT 
        SUM(CASE WHEN tipo_pago = 'Efectivo' THEN total ELSE 0 END) AS efectivo,
        SUM(CASE WHEN tipo_pago = 'Tarjeta' THEN total ELSE 0 END) AS tarjeta
      FROM comandas
      WHERE DATE(fecha) = :fecha
    `;
    replacements.id_usuario = id_usuario;
  }

  // ADMIN / SUPERADMIN → TODO
  if (rol === "admin" || rol === "superAdmin") {
    query = `
      SELECT
        SUM(efectivo) AS efectivo,
        SUM(transferencia) AS transferencia,
        SUM(tarjeta) AS tarjeta
      FROM (
        SELECT 
          SUM(CASE WHEN metodo = 'Efectivo' THEN monto ELSE 0 END) efectivo,
          SUM(CASE WHEN metodo = 'Transferencia' THEN monto ELSE 0 END) transferencia,
          SUM(CASE WHEN metodo IN ('Débito','Crédito') THEN monto ELSE 0 END) tarjeta
        FROM ingresos
        WHERE DATE(fecha) = :fecha

        UNION ALL

        SELECT 
          SUM(CASE WHEN tipo_pago = 'Efectivo' THEN total ELSE 0 END),
          SUM(CASE WHEN tipo_pago = 'Tarjeta' THEN total ELSE 0 END)
        FROM comandas
        WHERE DATE(fecha) = :fecha
      t
    `;
  }

  const data = await db.query(query, {
    replacements,
    type: db.Sequelize.QueryTypes.SELECT,
  });

  return {
    success: true,
    data: {
      efectivo: Number(data[0].efectivo || 0),
      transferencia: Number(data[0].transferencia || 0),
      tarjeta: Number(data[0].tarjeta || 0),
    },
  };
};



exports.createCierre = async (obj) => {
  try {
    const cierre = await CierreCaja.create(obj);
    await sendEmail({
      to: 'neansanchez@gmail.com',
      subject: 'Nuevo Cierre de Caja Registrado',
      action: 'Creación de Cierre de Caja',
      fields: { id_cierre: cierre.id_caja, Efectivo_Caja: cierre.efectivo_caja, Restante_Faltante: cierre.restante, 
        Observaciones: cierre.observaciones, usuario_cierre: cierre.usuario}
    });
    return { success: true, data: cierre };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.findAll = async ({ rol, id_usuario }) => {
  let where = {};

  if (rol !== "admin" && rol !== "superAdmin") {
    where.id_usuario = id_usuario;
  }

  const data = await Cierre.findAll({ where });
  return { success: true, data };
};

exports.listarCierres = async () => {
  const query = `
    SELECT 
      c.id_caja,
      c.fecha,
      c.efectivo_caja,
      c.restante,
      c.observaciones,
       CASE 
    WHEN c.estado = 0 THEN 'Cierre realizado'
    ELSE 'Pendiente'
  END AS estado,
      u.nombre AS usuario,
      a.nombre AS area
    FROM cierre_caja c
    INNER JOIN usuarios u ON u.id_usuario = c.id_usuario
    INNER JOIN areas a ON a.id_area = c.id_area
    ORDER BY c.fecha DESC
  `;

 const data = await db.query(query, {
    type: db.Sequelize.QueryTypes.SELECT,
  });

  return { success: true, data };
};

