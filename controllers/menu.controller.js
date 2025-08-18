const {
  findById,
  findAll,
  findAllByQuery,
  create,
  deleteById,
  updateByIdS,
} = require("../services/menu.services");

// Mensajes locales opcionales
const successMessages = {
  SUCCESS_FINDALL: "Listado de menú obtenido correctamente",
  SUCCESS_FIND: "Menú encontrado",
  SUCCESS_ADD: "Menú registrado correctamente",
  SUCCESS_UPDATE: "Menú actualizado correctamente",
  SUCCESS_DELETE: "Menú eliminado correctamente",
};

const errorMessages = {
  ERROR_FINDALL: "Error al obtener Menú",
  ERROR_FIND: "No se pudo encontrar el menú",
  ERROR_ADD: "Error al registrar el menú",
  ERROR_UPDATE: "Error al actualizar el menú",
  ERROR_DELETE: "Error al eliminar el menú",
  ERROR_DUPLICADO: "Menú ya registrado",
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
  const body = { ...req.body, id_menu: id };

  const result = await updateByIdS(body);

if (result.success) {
    res.status(200).json({ valid: true, msg: successMessages.SUCCESS_DELETE });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_DELETE });
  }
};


exports.deleteById = async (req, res) => {
  const id_menu = req.params.id;
  const result = await deleteById(id_menu);

  if (result.success) {
    res.status(200).json({ valid: true, msg: successMessages.SUCCESS_DELETE });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_DELETE });
  }
};
