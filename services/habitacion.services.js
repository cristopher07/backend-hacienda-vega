const { Op } = require("sequelize");
const db = require("../config/db");
const HabitacionModel = require("../model/habitacion.model");
const Habitacion = HabitacionModel(db, db.Sequelize);

exports.findById = async (id_habitacion) => {
  try {
    const habitacion = await Habitacion.findByPk(id_habitacion);
    return { success: true, data: habitacion };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.findAll = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  try {
    const result = await Habitacion.findAll({
      offset: paginacion === '' ? (page * rowsPerPage) : undefined,
      limit: paginacion === '' ? parseInt(rowsPerPage) : undefined,
      where: {
        tipo_habitacion: {
          [Op.substring]: busqueda
        },
        numero_habitacion: {
          [Op.substring]: busqueda
        },
        huespedes: {
          [Op.substring]: busqueda
        },
        precio: {
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
      id_habitacion, 
      tipo_habitacion, 
      numero_habitacion,
      huespedes,
      precio,
      estado,
      activo
    FROM haciendalavega_sistema.habitaciones
    WHERE activo = 1
      AND CONCAT(tipo_habitacion, ' ', numero_habitacion) LIKE ('%' :busqueda '%')
  `;

  if (paginacion === "") {
    query += `
      ORDER BY tipo_habitacion
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
  try {
    const [habitacion, created] = await Habitacion.findOrCreate({
      where: { tipo_habitacion: obj.tipo_habitacion, numero_habitacion: obj.numero_habitacion, huespedes: obj.huespedes, precio: obj.precio, activo: true },
      defaults: { ...obj, activo: true }
    });

    return { success: true, data: habitacion, created };
  } catch (error) {
    return { success: false, error: error.message };
  }
};



exports.updateByIdS = async (obj) => {
  try {
    const duplicate = await Habitacion.findAll({
      where: {
        tipo_habitacion: obj.tipo_habitacion,
        numero_habitacion: obj.numero_habitacion,
        huespedes: obj.huespedes,
        precio: obj.precio,
        activo: true,
        id_habitacion: { [Op.not]: obj.id_habitacion }
      }
    });

    if (duplicate.length > 0) {
      return { success: false, message: "Habitación duplicada" };
    }

    const result = await Habitacion.update(
      {
        tipo_habitacion: obj.tipo_habitacion,
        numero_habitacion: obj.numero_habitacion,
        huespedes: obj.huespedes,
        precio: obj.precio
      },
      {
        where: { id_habitacion: obj.id_habitacion }
      }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.deleteById = async (id_habitacion) => {
  try {
    const result = await Habitacion.update(
      { activo: false },
      { where: { id_habitacion } }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

