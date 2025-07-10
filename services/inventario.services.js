const { Op } = require("sequelize");
const db = require("../config/db");
const InventarioModel = require("../model/inventario.model");
const Inventario = InventarioModel(db, db.Sequelize);

exports.findById = async (id_inventario) => {
  try {
    const inventario = await Inventario.findByPk(id_inventario);
    return { success: true, data: inventario };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.findAll = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  try {
    const result = await Inventario.findAll({
      offset: paginacion === '' ? (page * rowsPerPage) : undefined,
      limit: paginacion === '' ? parseInt(rowsPerPage) : undefined,
      where: {
        producto: {
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
      i.id_inventario, 
      i.producto, 
      i.categoria, 
      i.stock, 
      i.costo, 
      i.precio_vta, 
      i.estado, 
      i.id_area, 
      i.activo,
      a.id_area as idArea,
      a.nombre as nombreArea
    FROM haciendalavega_sistema.inventarios i
    LEFT JOIN haciendalavega_sistema.areas a ON a.id_area = i.id_area
    WHERE i.activo = 1
      AND CONCAT(i.producto, ' ', i.categoria, ' ', a.nombre) LIKE ('%' :busqueda '%')
  `;

  if (paginacion === "") {
    query += `
      ORDER BY i.id_inventario
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
    // Verificar duplicado por producto en la misma área
    const exists = await Inventario.findOne({
      where: {
        producto: obj.producto,
        id_area: obj.id_area,
        activo: true
      }
    });

    if (exists) {
      return { success: false, message: "Ya existe un producto con este nombre en la misma área." };
    }

    // Crear el nuevo inventario
    const newInventario = await Inventario.create({
      ...obj,
      activo: true
    });

    return { success: true, data: newInventario, created: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.updateByIdS = async (obj) => {
  try {
    const duplicate = await Inventario.findAll({
      where: {
        producto: obj.producto,
        id_area: obj.id_area,
        activo: true,
        id_inventario: { [Op.not]: obj.id_inventario }
      }
    });

    if (duplicate.length > 0) {
      return { success: false, message: "Producto duplicado en la misma área" };
    }

    const updates = {
      producto: obj.producto,
      categoria: obj.categoria,
      stock: obj.stock,
      costo: obj.costo,
      precio_vta: obj.precio_vta,
      estado: obj.estado,
      id_area: obj.id_area,
    };

    const result = await Inventario.update(
      updates,
      { where: { id_inventario: obj.id_inventario } }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.deleteById = async (id_inventario) => {
  try {
    const result = await Inventario.update(
      { activo: false },
      { where: { id_inventario } }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
