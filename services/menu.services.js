const { Op } = require("sequelize");
const db = require("../config/db");
const MenuModel = require("../model/menu.model");
const Menu = MenuModel(db, db.Sequelize);

exports.findById = async (id_menu) => {
  try {
    const menu = await Menu.findByPk(id_menu);
    return { success: true, data: menu };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.findAll = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  try {
    const result = await Menu.findAll({
      offset: paginacion === '' ? (page * rowsPerPage) : undefined,
      limit: paginacion === '' ? parseInt(rowsPerPage) : undefined,
      where: {
        tipo_menu: {
          [Op.substring]: busqueda
        },
        descripcion: {
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
      id_menu, 
      tipo_menu, 
      descripcion,
      precio,
      estado,
      activo
    FROM haciendalavega_sistema.crud_menu
    WHERE activo = 1
      AND CONCAT(tipo_menu, ' ', descripcion) LIKE ('%' :busqueda '%')
  `;

  if (paginacion === "") {
    query += `
      ORDER BY tipo_menu
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
    const [menu, created] = await Menu.findOrCreate({
      where: { tipo_menu: obj.tipo_menu, descripcion: obj.descripcion, precio: obj.precio, activo: true },
      defaults: { ...obj, activo: true }
    });

    return { success: true, data: menu, created };
  } catch (error) {
    return { success: false, error: error.message };
  }
};



exports.updateByIdS = async (obj) => {
  try {
    const duplicate = await Menu.findAll({
      where: {
        tipo_menu: obj.tipo_menu,
        descripcion: obj.descripcion,
        precio: obj.precio,
        activo: true,
        id_menu: { [Op.not]: obj.id_menu }
      }
    });

    if (duplicate.length > 0) {
      return { success: false, message: "Menú duplicado" };
    }

    const result = await Menu.update(
      {
        tipo_menu: obj.tipo_menu,
        descripcion: obj.descripcion,
        precio: obj.precio
      },
      {
        where: { id_menu: obj.id_menu }
      }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.deleteById = async (id_menu) => {
  try {
    const result = await Menu.update(
      { activo: false },
      { where: { id_menu } }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

