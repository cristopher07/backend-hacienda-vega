const { Op } = require("sequelize");
const db = require("../config/db");
const MesaModel = require("../model/mesa.model");
const Mesa = MesaModel(db, db.Sequelize);

exports.findById = async (id_mesa) => {
  try {
    const mesa = await Mesa.findByPk(id_mesa);
    return { success: true, data: mesa };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.findAll = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  try {
    const result = await Mesa.findAll({
      offset: paginacion === '' ? (page * rowsPerPage) : undefined,
      limit: paginacion === '' ? parseInt(rowsPerPage) : undefined,
      where: {
        tipo_de_mesa: {
          [Op.substring]: busqueda
        },
        capacidad: {
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
      id_mesa, 
      tipo_de_mesa, 
      capacidad,
      nombre,
      estado,
      activo
    FROM haciendalavega_sistema.crud_mesas
    WHERE activo = 1
      AND CONCAT(tipo_de_mesa, ' ', capacidad, ' ', nombre) LIKE ('%' :busqueda '%')
  `;

  if (paginacion === "") {
    query += `
      ORDER BY tipo_de_mesa
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
  console.log("obj-----: ", obj);
  try {
    const [mesa, created] = await Mesa.findOrCreate({
      where: { nombre: obj.nombre, tipo_de_mesa: obj.tipo_de_mesa, capacidad: obj.capacidad, activo: true },
      defaults: { ...obj, activo: true }
    });

    return { success: true, data: mesa, created };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


exports.updateByIdS = async (obj) => {
  try {
    // Verificar duplicado por nombre (no por tipo_de_mesa y capacidad)
    const duplicate = await Mesa.findAll({
      where: {
        nombre: obj.nombre,
        activo: true,
        id_mesa: { [Op.not]: obj.id_mesa }
      }
    });

    if (duplicate.length > 0) {
      return { success: false, message: "Ya existe una mesa con ese nombre" };
    }


    const result = await Mesa.update(
      {
        tipo_de_mesa: obj.tipo_de_mesa,
        capacidad: obj.capacidad,
        nombre: obj.nombre,
        estado: obj.estado
      },
      {
        where: { id_mesa: obj.id_mesa }
      }
    );


    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.deleteById = async (id_mesa) => {
  try {
    const result = await Mesa.update(
      { activo: false },
      { where: { id_mesa } }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
