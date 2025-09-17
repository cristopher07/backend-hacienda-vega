const {
  findById,
  findAll,
  create,
  deleteById,
  updateByIdS,
  findAllByQuery
} = require("../services/ingreso.services");

const successMessages = {
  SUCCESS_FINDALL: "Listado de ingresos obtenido correctamente",
  SUCCESS_FIND: "Ingreso encontrado",
  SUCCESS_ADD: "Ingreso registrado correctamente",
  SUCCESS_UPDATE: "Ingreso actualizado correctamente",
  SUCCESS_DELETE: "Ingreso eliminado correctamente",
};

const errorMessages = {
  ERROR_FINDALL: "Error al obtener ingresos",
  ERROR_FIND: "No se pudo encontrar el ingreso",
  ERROR_ADD: "Error al registrar el ingreso",
  ERROR_UPDATE: "Error al actualizar el ingreso",
  ERROR_DELETE: "Error al eliminar el ingreso",
  ERROR_DUPLICADO: "Ingreso ya registrado",
};

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
    const msg = result.message || errorMessages.ERROR_ADD;
    res.status(400).json({ valid: false, msg });
  }
};

exports.updateByIdC = async (req, res) => {
  const id = req.params.id;
  const body = { ...req.body, id_ingreso: id };
  const result = await updateByIdS(body);
  if (result.success) {
    res.status(200).json({ valid: true, data: result.data, msg: successMessages.SUCCESS_UPDATE });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_UPDATE });
  }
};

exports.deleteById = async (req, res) => {
  const id_ingreso = req.params.id;
  const result = await deleteById(id_ingreso);
  if (result.success) {
    res.status(200).json({ valid: true, msg: successMessages.SUCCESS_DELETE });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_DELETE });
  }
};