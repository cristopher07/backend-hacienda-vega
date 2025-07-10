const {
  findById,
  findAll,
  create,
  deleteById,
  updateByIdS,
  findAllByQuery
} = require("../services/inventario.services");

// Mensajes locales opcionales
const successMessages = {
  SUCCESS_FINDALL: "Listado de inventarios obtenido correctamente",
  SUCCESS_FIND: "Inventario encontrado",
  SUCCESS_ADD: "Inventario registrado correctamente",
  SUCCESS_UPDATE: "Inventario actualizado correctamente",
  SUCCESS_DELETE: "Inventario eliminado correctamente",
};

const errorMessages = {
  ERROR_FINDALL: "Error al obtener inventarios",
  ERROR_FIND: "No se pudo encontrar el inventario",
  ERROR_ADD: "Error al registrar el inventario",
  ERROR_UPDATE: "Error al actualizar el inventario",
  ERROR_DELETE: "Error al eliminar el inventario",
  ERROR_DUPLICADO: "Inventario ya registrado",
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
  const body = { ...req.body, id_inventario: id };

  const result = await updateByIdS(body);

  if (result.success) {
    res.status(200).json({ valid: true, data: result.data, msg: successMessages.SUCCESS_UPDATE });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_UPDATE });
  }
};

exports.deleteById = async (req, res) => {
  const id_inventario = req.params.id;
  const result = await deleteById(id_inventario);

  if (result.success) {
    res.status(200).json({ valid: true, msg: successMessages.SUCCESS_DELETE });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_DELETE });
  }
};
