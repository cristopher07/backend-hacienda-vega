
const db = require('../config/db');
const ComandaModel = require('../model/comanda.model');
const Comanda = ComandaModel(db, db.Sequelize);
const { Op } = require("sequelize");

exports.create = async (obj) => {
  console.log("----obj: ", obj);
  try {
    if (Array.isArray(obj)) {
      console.log("obj es array");
      // Mapear id_bebida a id_bebidas y asegurar id_menu null si viene vacío
      const mappedArray = obj.map(item => ({
        ...item,
        id_bebidas: item.id_bebida,
        id_menu: (item.id_menu === undefined || item.id_menu === '' || item.id_menu === null) ? null : item.id_menu
      }));
      const newComandas = await Comanda.bulkCreate(mappedArray);
      return { success: true, data: newComandas };
    } else {
      // Mapear id_bebida a id_bebidas y asegurar id_menu null si viene vacío
      const mappedObj = {
        ...obj,
        id_bebidas: obj.id_bebida,
        id_menu: (obj.id_menu === undefined || obj.id_menu === '' || obj.id_menu === null) ? null : obj.id_menu
      };
      const newComanda = await Comanda.create(mappedObj);
      return { success: true, data: newComanda };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};



exports.findAll = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  try {
    const result = await Comanda.findAll({
      offset: paginacion === '' ? (page * rowsPerPage) : undefined,
      limit: paginacion === '' ? parseInt(rowsPerPage) : undefined,
      where: {
        [Op.or]: [
          { estado: { [Op.substring]: busqueda } },
          { observacion: { [Op.substring]: busqueda } },
          { tipo_pago: { [Op.substring]: busqueda } },
          { fecha: { [Op.substring]: busqueda } },
          { total: { [Op.substring]: busqueda } },
        ],
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

exports.findAllComandasQuery = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  let query = `
    SELECT COUNT(1) OVER() AS count,
      c.id_comanda as id_comanda,
      c.id_mesa as id_mesa,
      c.id_menu as id_menu,
      c.id_bebidas as id_bebidas,
      c.subtotal as subtotal,
      c.fecha as fecha,
      c.observacion as observacion,
      c.estado as estado,
      c.total as total,
      c.tipo_pago as tipo_pago,
      c.activo as activo,
      cm.descripcion as nombreMenu,
      cm.id_menu as idMenu,
      cm2.nombre as nombreMesa,
      cb.descripcion as nombreBebida
    FROM haciendalavega_sistema.comandas c
    LEFT JOIN crud_menu cm ON cm.id_menu = c.id_menu
    LEFT JOIN crud_mesas cm2 ON cm2.id_mesa = c.id_mesa
    LEFT JOIN crud_bebidas cb ON cb.id_bebida = c.id_bebidas
    WHERE c.activo = 1
      AND (
        :busqueda = ''
        OR CONCAT(
            IFNULL(cm.descripcion, ''),
            ' ',
            IFNULL(cm2.nombre, ''),
            ' ',
            IFNULL(cb.descripcion, ''),
            ' ',
            IFNULL(c.estado, ''),
            ' ',
            IFNULL(c.tipo_pago, '')
          ) LIKE ('%' :busqueda '%')
      )
  `;

  if (paginacion === "") {
    query += `
      ORDER BY c.id_comanda DESC
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

exports.findById = async (id_comanda) => {
  try {
    const comanda = await Comanda.findByPk(id_comanda);
    return { success: true, data: comanda };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.updateById = async (id_comanda, obj) => {
  try {
    const result = await Comanda.update(obj, { where: { id_comanda } });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.deleteById = async (id_comanda) => {
  try {
    const result = await Comanda.update({ activo: false }, { where: { id_comanda } });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};