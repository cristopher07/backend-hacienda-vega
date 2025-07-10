const {
  findById,
  findAll,
  create,
  deleteById,
  updateByIdS,
} = require("../services/bebida.services");

// Mensajes locales opcionales
const successMessages = {
  SUCCESS_FINDALL: "Listado de bebidas obtenido correctamente",
  SUCCESS_FIND: "Bebida encontrada",
  SUCCESS_ADD: "Bebida registrada correctamente",
  SUCCESS_UPDATE: "Bebida actualizada correctamente",
  SUCCESS_DELETE: "Bebida eliminada correctamente",
};

const errorMessages = {
  ERROR_FINDALL: "Error al obtener Bebida",
  ERROR_FIND: "No se pudo encontrar la bebida",
  ERROR_ADD: "Error al registrar la bebida",
  ERROR_UPDATE: "Error al actualizar la bebida",
  ERROR_DELETE: "Error al eliminar la bebida",
  ERROR_DUPLICADO: "Bebida ya registrada",
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

exports.create = async (req, res) => {
  const obj = { ...req.body, ipAddress: req.connection.remoteAddress };
  const result = await create(obj);

  if (result.success) {
    if (result.created) {
      res.status(201).json({ ok: true, data: result.data, msg: successMessages.SUCCESS_ADD });
    } else {
      res.status(200).json({ ok: false, msg: errorMessages.ERROR_DUPLICADO });
    }
  } else {
    res.status(400).json({ ok: false, msg: errorMessages.ERROR_ADD });
  }
};

exports.updateByIdC = async (req, res) => {
  const id = req.params.id;
  const body = { ...req.body, id_bebida: id };

  const result = await updateByIdS(body);


  if (result.success) {
    res.status(200).json({ ok: true, data: result.data, msg: successMessages.SUCCESS_UPDATE });
  } else {
    res.status(400).json({ ok: false, msg: errorMessages.ERROR_UPDATE });
  }
};


exports.deleteById = async (req, res) => {
  const id_bebida = req.params.id;
  const result = await deleteById(id_bebida);

  if (result.success) {
    res.status(200).json({ ok: true, msg: successMessages.SUCCESS_DELETE });
  } else {
    res.status(400).json({ ok: false, msg: errorMessages.ERROR_DELETE });
  }
};
