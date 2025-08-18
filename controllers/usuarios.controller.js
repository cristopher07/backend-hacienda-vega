const {
  findById,
  findAll,
  create,
  deleteById,
  updateByIdS,
  findAllByQuery,
  login
} = require("../services/usuarios.services");

// Mensajes locales opcionales
const successMessages = {
  SUCCESS_FINDALL: "Listado de usuarios obtenido correctamente",
  SUCCESS_FIND: "Usuario encontrado",
  SUCCESS_ADD: "Usuario registrado correctamente",
  SUCCESS_UPDATE: "Usuario actualizado correctamente",
  SUCCESS_DELETE: "Usuario eliminado correctamente",
  SUCCESS_LOGIN: "Login exitoso",
};

const errorMessages = {
  ERROR_FINDALL: "Error al obtener usuarios",
  ERROR_FIND: "No se pudo encontrar el usuario",
  ERROR_ADD: "Error al registrar el usuario",
  ERROR_UPDATE: "Error al actualizar el usuario",
  ERROR_DELETE: "Error al eliminar el usuario",
  ERROR_DUPLICADO: "Usuario ya registrado",
  ERROR_LOGIN: "Error en el login",
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
  const body = { ...req.body, id_usuario: id };

  const result = await updateByIdS(body);

  if (result.success) {
    res.status(200).json({ valid: true, data: result.data, msg: successMessages.SUCCESS_UPDATE });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_UPDATE });
  }
};


exports.deleteById = async (req, res) => {
  const id_usuario = req.params.id;
  const result = await deleteById(id_usuario);

  if (result.success) {
    res.status(200).json({ valid: true, msg: successMessages.SUCCESS_DELETE });
  } else {
    res.status(400).json({ valid: false, msg: errorMessages.ERROR_DELETE });
  }
};

exports.login = async (req, res) => {
  const { usuario, password } = req.body;

  // Validar que se envíen los campos requeridos
  if (!usuario || !password) {
    return res.status(400).json({ 
      valid: false, 
      msg: "Usuario y contraseña son requeridos" 
    });
  }

  const result = await login(usuario, password);

  if (result.success) {
    res.status(200).json({ 
      valid: true, 
      data: result.data, 
      msg: result.message || successMessages.SUCCESS_LOGIN 
    });
  } else {
    // Usar el mensaje específico del servicio o el genérico
    const msg = result.message || errorMessages.ERROR_LOGIN;
    res.status(401).json({ valid: false, msg });
  }
};
