const { Op } = require("sequelize");
const db = require("../config/db");
const BrazaleteModel = require("../model/brazaletes.model");
const Brazalete = BrazaleteModel(db, db.Sequelize);

exports.findById = async (id_brazalete) => {
  try {
    const brazalete = await Brazalete.findByPk(id_brazalete);
    return { success: true, data: brazalete };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.findAll = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  try {
    const result = await Brazalete.findAll({
      offset: paginacion === '' ? (page * rowsPerPage) : undefined,
      limit: paginacion === '' ? parseInt(rowsPerPage) : undefined,
      where: {
        tipo_brazalete: {
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
      id_brazalete, 
      tipo_brazalete,
      precio,
      activo
    FROM haciendalavega_sistema.brazaletes
    WHERE activo = 1
      AND CONCAT(tipo_brazalete, ' ', precio) LIKE ('%' :busqueda '%')
  `;

  if (paginacion === "") {
    query += `
      ORDER BY tipo_brazalete
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
    const [brazalete, created] = await Brazalete.findOrCreate({
      where: { tipo_brazalete: obj.tipo_brazalete, activo: true },
      defaults: { ...obj, activo: true }
    });

    return { success: true, data: brazalete, created };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.updateByIdS = async (obj) => {
  try {
    const duplicate = await Brazalete.findAll({
      where: {
        tipo_brazalete: obj.tipo_brazalete,
        precio: obj.precio,
        activo: true,
        id_brazalete: { [Op.not]: obj.id_brazalete }
      }
    });

    if (duplicate.length > 0) {
      return { success: false, message: "Brazalete duplicada" };
    }

    const result = await Brazalete.update(
      {
        tipo_brazalete: obj.tipo_brazalete,
        precio: obj.precio
      },
      {
        where: { id_brazalete: obj.id_brazalete }
      }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.deleteById = async (id_brazalete) => {
  try {
    const result = await Brazalete.update(
      { activo: false },
      { where: { id_brazalete } }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
