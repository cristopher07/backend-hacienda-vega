const {
  findById,
  findAll,
  create,
  deleteById,
  updateByIdS,
} = require("../services/area.services");

// Mensajes locales opcionales
const successMessages = {
  SUCCESS_FINDALL: "Listado de áreas obtenido correctamente",
  SUCCESS_FIND: "Área encontrada",
  SUCCESS_ADD: "Área registrada correctamente",
  SUCCESS_UPDATE: "Área actualizada correctamente",
  SUCCESS_DELETE: "Área eliminada correctamente",
};

const errorMessages = {
  ERROR_FINDALL: "Error al obtener áreas",
  ERROR_FIND: "No se pudo encontrar el área",
  ERROR_ADD: "Error al registrar el área",
  ERROR_UPDATE: "Error al actualizar el área",
  ERROR_DELETE: "Error al eliminar el área",
  ERROR_DUPLICADO: "Área ya registrada",
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
  const body = { ...req.body, id_area: id };

  const result = await updateByIdS(body);

  if (result.success) {
    res.status(200).json({ ok: true, data: result.data, msg: successMessages.SUCCESS_UPDATE });
  } else {
    res.status(400).json({ ok: false, msg: errorMessages.ERROR_UPDATE });
  }
};


exports.deleteById = async (req, res) => {
  const id_area = req.params.id;
  const result = await deleteById(id_area);

  if (result.success) {
    res.status(200).json({ ok: true, msg: successMessages.SUCCESS_DELETE });
  } else {
    res.status(400).json({ ok: false, msg: errorMessages.ERROR_DELETE });
  }
};
