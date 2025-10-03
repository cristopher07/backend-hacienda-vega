const {
  findById,
  findAll,
  findAllByQuery,
  create,
  deleteById,
  updateByIdS,
} = require("../services/mesa.services");

// Mensajes locales opcionales
const successMessages = {
  SUCCESS_FINDALL: "Listado de mesas obtenido correctamente",
  SUCCESS_FIND: "Mesa encontrada",
  SUCCESS_ADD: "Mesa registrada correctamente",
  SUCCESS_UPDATE: "Mesa actualizada correctamente",
  SUCCESS_DELETE: "Mesa eliminada correctamente",
};

const errorMessages = {
  ERROR_FINDALL: "Error al obtener Mesa",
  ERROR_FIND: "No se pudo encontrar la mesa",
  ERROR_ADD: "Error al registrar la mesa",
  ERROR_UPDATE: "Error al actualizar la mesa",
  ERROR_DELETE: "Error al eliminar la mesa",
  ERROR_DUPLICADO: "Mesa ya registrada",
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
  const body = { ...req.body, id_mesa: id };

  const result = await updateByIdS(body);

  if (result.success) {
    res.status(200).json({ valid: true, data: result.data, msg: successMessages.SUCCESS_UPDATE });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_UPDATE });
  }
};


exports.deleteById = async (req, res) => {
  const id_mesa = req.params.id;
  const result = await deleteById(id_mesa);

  if (result.success) {
    res.status(200).json({ valid: true, msg: successMessages.SUCCESS_DELETE });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_DELETE });
  }
};
