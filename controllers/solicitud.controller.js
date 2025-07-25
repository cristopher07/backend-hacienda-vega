const {
  findById,
  findAll,
  create,
  deleteById,
  updateByIdS,
  findAllByQuery
} = require("../services/solicitud.services");

// Mensajes locales opcionales
const successMessages = {
  SUCCESS_FINDALL: "Listado de solicitudes obtenido correctamente",
  SUCCESS_FIND: "Solicitud encontrada",
  SUCCESS_ADD: "Solicitud registrada correctamente",
  SUCCESS_UPDATE: "Solicitud actualizada correctamente",
  SUCCESS_DELETE: "Solicitud eliminada correctamente",
};

const errorMessages = {
  ERROR_FINDALL: "Error al obtener solicitudes",
  ERROR_FIND: "No se pudo encontrar la solicitud",
  ERROR_ADD: "Error al registrar la solicitud",
  ERROR_UPDATE: "Error al actualizar la solicitud",
  ERROR_DELETE: "Error al eliminar la solicitud",
  ERROR_DUPLICADO: "Solicitud ya registrada",
};

// ✅ CRUD Controllers

exports.findAll = async (req, res) => {
  const result = await findAll(req.query);

  if (result.success) {
    res.status(200).json({ valid: true, data: result.data, msg: successMessages.SUCCESS_FINDALL });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_FINDALL });
  }
};

exports.findAllQuery = async (req, res) => {
  const result = await findAllByQuery(req.query);

  if (result.success) {
    res.status(200).json({ valid: true, data: result.data, msg: successMessages.SUCCESS_FINDALL });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_FINDALL });
  }
};

exports.findById = async (req, res) => {
  const result = await findById(req.params.id);

  if (result.success) {
    res.status(200).json({ valid: true, data: result.data, msg: successMessages.SUCCESS_FIND });
  } else {
    res.status(404).json({ valid: false, msg: errorMessages.ERROR_FIND });
  }
};

exports.create = async (req, res) => {
  const obj = { ...req.body, ipAddress: req.connection.remoteAddress };
  const result = await create(obj);

  if (result.success) {
    if (result.created) {
      res.status(201).json({ valid: true, data: result.data, msg: successMessages.SUCCESS_ADD });
    } else {
      res.status(200).json({ valid: false, msg: errorMessages.ERROR_DUPLICADO });
    }
  } else {
    // Si tu servicio devuelve `message` cuando es duplicado, úsalo.
    const msg = result.message || errorMessages.ERROR_ADD;
    res.status(400).json({ valid: false, msg });
  }
};

exports.updateByIdC = async (req, res) => {
  const id = req.params.id;
  const body = { ...req.body, id_solicitud: id };

  const result = await updateByIdS(body);

  if (result.success) {
    res.status(200).json({ valid: true, data: result.data, msg: successMessages.SUCCESS_UPDATE });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_UPDATE });
  }
};

exports.deleteById = async (req, res) => {
  const id_solicitud = req.params.id;
  const result = await deleteById(id_solicitud);

  if (result.success) {
    res.status(200).json({ valid: true, msg: successMessages.SUCCESS_DELETE });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_DELETE });
  }
};
