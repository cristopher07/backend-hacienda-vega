const {
  findById,
  findAll,
  findAllByQuery,
  create,
  deleteById,
  updateByIdS,
} = require("../services/habitacion.services");

// Mensajes locales opcionales
const successMessages = {
  SUCCESS_FINDALL: "Listado de habitaciones obtenido correctamente",
  SUCCESS_FIND: "Habitación encontrada",
  SUCCESS_ADD: "Habitación registrada correctamente",
  SUCCESS_UPDATE: "Habitación actualizada correctamente",
  SUCCESS_DELETE: "Habitación eliminada correctamente",
};

const errorMessages = {
  ERROR_FINDALL: "Error al obtener Habitación",
  ERROR_FIND: "No se pudo encontrar habitación",
  ERROR_ADD: "Error al registrar habitación",
  ERROR_UPDATE: "Error al actualizar habitación",
  ERROR_DELETE: "Error al eliminar habitación",
  ERROR_DUPLICADO: "Habitación ya registrada",
};

// ✅ CRUD Controllers

exports.findAll = async (req, res) => {
  const result = await findAll(req.query);

  if (result.success) {
    res.status(200).json({ ok: true, data: result.data, msg: successMessages.SUCCESS_FINDALL });
  } else {
    res.status(400).json({ ok: false, msg: errorMessages.ERROR_FINDALL });
  }
};

exports.findById = async (req, res) => {
  const result = await findById(req.params.id);

  if (result.success) {
    res.status(200).json({ ok: true, data: result.data, msg: successMessages.SUCCESS_FIND });
  } else {
    res.status(404).json({ ok: false, msg: errorMessages.ERROR_FIND });
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
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_ADD });
  }
};


exports.updateByIdC = async (req, res) => {
  const id = req.params.id;
  const body = { ...req.body, id_habitacion: id };

  const result = await updateByIdS(body);

if (result.success) {
    res.status(200).json({ valid: true, msg: successMessages.SUCCESS_DELETE });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_DELETE });
  }
};


exports.deleteById = async (req, res) => {
  const id_habitacion = req.params.id;
  const result = await deleteById(id_habitacion);

  if (result.success) {
    res.status(200).json({ valid: true, msg: successMessages.SUCCESS_DELETE });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_DELETE });
  }
};
