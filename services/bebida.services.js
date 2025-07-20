const { Op } = require("sequelize");
const db = require("../config/db");
const BebidaModel = require("../model/bebida.model");
const Bebida = BebidaModel(db, db.Sequelize);

exports.findById = async (id_bebida) => {
  try {
    const bebida = await Bebida.findByPk(id_bebida);
    return { success: true, data: bebida };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.findAll = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  try {
    const result = await Bebida.findAll({
      offset: paginacion === '' ? (page * rowsPerPage) : undefined,
      limit: paginacion === '' ? parseInt(rowsPerPage) : undefined,
      where: {
        [Op.and]: [
          { activo: true },
          {
            [Op.or]: [
              { tipo_bebida: { [Op.substring]: busqueda } },
              { descripcion: { [Op.substring]: busqueda } },
              { precio: { [Op.substring]: busqueda } },
            ]
          }
        ]
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


/*exports.findAll = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  try {
    const result = await Bebida.findAll({
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
*/
exports.create = async (obj) => {
  try {
    const [bebida, created] = await Bebida.findOrCreate({
      where: { tipo_bebida: obj.tipo_bebida, descripcion: obj.descripcion, precio: obj.precio, activo: true },
      defaults: { ...obj, activo: true }
    });

    return { success: true, data: bebida, created };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.updateByIdS = async (obj) => {
  try {
    const duplicate = await Bebida.findAll({
      where: {
        tipo_bebida: obj.tipo_bebida,
        descripcion: obj.descripcion,
        precio: obj.precio,
        activo: true,
        id_bebida: { [Op.not]: obj.id_bebida }
      }
    });

    if (duplicate.length > 0) {
      return { success: false, message: "Bebida duplicada" };
    }

    const result = await Bebida.update(
      {
        tipo_bebida: obj.tipo_bebida,
        descripcion: obj.descripcion,
        precio: obj.precio
      },
      {
        where: { id_bebida: obj.id_bebida }
      }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.deleteById = async (id_bebida) => {
  try {
    const result = await Bebida.update(
      { activo: false },
      { where: { id_bebida } }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
