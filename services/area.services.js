const { Op } = require("sequelize");
const db = require("../config/db");
const AreaModel = require("../model/area.model");
const Area = AreaModel(db, db.Sequelize);

exports.findById = async (id_area) => {
  try {
    const area = await Area.findByPk(id_area);
    return { success: true, data: area };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.findAll = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  try {
    const result = await Area.findAll({
      offset: paginacion === '' ? (page * rowsPerPage) : undefined,
      limit: paginacion === '' ? parseInt(rowsPerPage) : undefined,
      where: {
        nombre: {
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



exports.create = async (obj) => {
  try {
    const [area, created] = await Area.findOrCreate({
      where: { nombre: obj.nombre, activo: true },
      defaults: { ...obj, activo: true }
    });

    return { success: true, data: area, created };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.updateByIdS = async (obj) => {
  try {
    const duplicate = await Area.findAll({
      where: {
        nombre: obj.nombre,
        activo: true,
        id_area: { [Op.not]: obj.id_area }
      }
    });

    if (duplicate.length > 0) {
      return { success: false, message: "Nombre duplicado" };
    }

    const result = await Area.update(
      { nombre: obj.nombre },
      { where: { id_area: obj.id_area } }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.deleteById = async (id_area) => {
  try {
    const result = await Area.update(
      { activo: false },
      { where: { id_area } }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
