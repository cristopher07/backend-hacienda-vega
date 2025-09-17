const { Op } = require("sequelize");
const db = require("../config/db");
const IngresoModel = require("../model/ingreso.model");
const Ingreso = IngresoModel(db, db.Sequelize);
const { sendEmail } = require('../utils/email');

exports.findById = async (id_ingreso) => {
  try {
    const ingreso = await Ingreso.findByPk(id_ingreso);
    return { success: true, data: ingreso };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.findAll = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  try {
    const result = await Ingreso.findAll({
      offset: paginacion === '' ? (page * rowsPerPage) : undefined,
      limit: paginacion === '' ? parseInt(rowsPerPage) : undefined,
      where: {
        descripcion: {
          [Op.substring]: busqueda
        },
        activo: true
      },
      attributes: {
        include: [
          [db.literal('COUNT(1) OVER()'), 'count'],
        ]
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.findAllByQuery = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  let query = `
    SELECT COUNT(1) OVER() AS count,
      i.id_ingreso,
      i.id_area,
      i.descripcion,
      i.metodo,
      i.monto,
      i.fecha,
      i.activo,
      i.monto as precio,
      a.id_area as idArea,
      a.nombre as nombreArea
    FROM haciendalavega_sistema.ingresos i
    LEFT JOIN haciendalavega_sistema.areas a ON a.id_area = i.id_area
    WHERE i.activo = 1
      AND CONCAT(i.descripcion, ' ', i.metodo, ' ', a.nombre) LIKE ('%' :busqueda '%')
  `;

  if (paginacion === "") {
    query += `
      ORDER BY i.id_ingreso DESC
      LIMIT ${page * rowsPerPage}, ${rowsPerPage}
    `;
  }

  return db
    .query(query, {
      replacements: { busqueda },
      type: db.Sequelize.QueryTypes.SELECT,
    })
    .then((response) => {
      return { success: true, data: response };
    })
    .catch((error) => {
      console.error(error);
      return { success: false, error: error.message };
    });
};

exports.create = async (obj) => {
    console.log("obj----: ", obj);
  try {
    const newIngreso = await Ingreso.create({
      ...obj,
      id_area: obj.idArea,
      descripcion: obj.descripcion,
      metodo: obj.metodo,
      monto: obj.precio,
      estado: obj.estado,
      fecha: obj.fecha || new Date(),
      activo: true
    });
    await sendEmail({
      to: 'crisrosar9@gmail.com',
      subject: 'Nuevo Ingreso Registrado',
      action: 'create',
      fields: { id_ingreso: newIngreso.id_ingreso, descripcion: newIngreso.descripcion, metodo: newIngreso.metodo, monto: newIngreso.monto, fecha: newIngreso.fecha }
    });
    return { success: true, data: newIngreso, created: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.updateByIdS = async (obj) => {
  try {
    const updates = {
      descripcion: obj.descripcion,
      metodo: obj.metodo,
      monto: obj.monto,
      fecha: obj.fecha,
      id_area: obj.id_area
    };

    const result = await Ingreso.update(
      updates,
      { where: { id_ingreso: obj.id_ingreso } }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.deleteById = async (id_ingreso) => {
  try {
    const result = await Ingreso.update(
      { activo: false },
      { where: { id_ingreso } }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};