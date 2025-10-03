const { Op } = require("sequelize");
const db = require("../config/db");
const SolicitudModel = require("../model/solicitud.model");
const Solicitud = SolicitudModel(db, db.Sequelize);
const { sendEmail } = require('../utils/email');

exports.findById = async (id_solicitud) => {
  try {
    const solicitud = await Solicitud.findByPk(id_solicitud);
    return { success: true, data: solicitud };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.findAll = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  try {
    const result = await Solicitud.findAll({
      offset: paginacion === '' ? (page * rowsPerPage) : undefined,
      limit: paginacion === '' ? parseInt(rowsPerPage) : undefined,
      where: {
        detalle: {
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
      s.id_solicitud, 
      s.fecha_solicitud, 
      s.id_usuario, 
      s.id_area, 
      s.detalle, 
      s.monto, 
      s.documento, 
      s.estado, 
      s.fecha_revision, 
      s.activo,
      u.id_usuario as idUsuario,
      u.nombre as nombreUsuario,
      a.id_area as idArea,
      a.nombre as nombreArea
    FROM haciendalavega_sistema.solicitudes s
    LEFT JOIN haciendalavega_sistema.usuarios u ON u.id_usuario = s.id_usuario
    LEFT JOIN haciendalavega_sistema.areas a ON a.id_area = s.id_area
    WHERE s.activo = 1
      AND CONCAT(s.detalle, ' ', u.nombre, ' ', a.nombre, ' ', s.documento) LIKE ('%' :busqueda '%')
  `;

  if (paginacion === "") {
    query += `
      ORDER BY s.id_solicitud DESC
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
  console.log("obj llege a crear solicitud: ", obj);
  try {
    // Crear la nueva solicitud con fecha actual si no se proporciona
    const newSolicitud = await Solicitud.create({
      ...obj,
      fecha_solicitud: obj.fecha_solicitud || new Date(),
      activo: true
    });
    await sendEmail({
      to: 'crisrosar9@gmail.com',
      subject: 'Nueva Solicitud Registrada',
      action: 'create',
      fields: { id_solicitud: newSolicitud.id_solicitud, detalle: newSolicitud.detalle, monto: newSolicitud.monto, documento: newSolicitud.documento, fecha_solicitud: newSolicitud.fecha_solicitud }
    });

    return { success: true, data: newSolicitud, created: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.updateByIdS = async (obj) => {
  try {
    const updates = {
      detalle: obj.detalle,
      monto: obj.monto,
      documento: obj.documento,
      estado: obj.estado,
      id_area: obj.id_area,
      id_usuario: obj.id_usuario,
      fecha_revision: obj.fecha_revision,
      fecha_solicitud: obj.fecha_solicitud || new Date(),
    };

    const result = await Solicitud.update(
      updates,
      { where: { id_solicitud: obj.id_solicitud } }
    );
    await sendEmail({
      to: 'crisrosar9@gmail.com',
      subject: 'Solicitud Actualizada',
      action: 'update',
      fields: { id_solicitud: obj.id_solicitud, detalle: obj.detalle, monto: obj.monto, documento: obj.documento, fecha_solicitud: obj.fecha_solicitud }
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.deleteById = async (id_solicitud) => {
  console.log("id_solicitud--- in delete: ", id_solicitud);
  try {
    const result = await Solicitud.update(
      { activo: false },
      { where: { id_solicitud } }
    );
    await sendEmail({
      to: 'crisrosar9@gmail.com',
      subject: 'Solicitud Eliminada',
      action: 'delete',
      fields: { id_solicitud: id_solicitud }
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
