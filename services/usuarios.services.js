const { Op } = require("sequelize");
const db = require("../config/db");
const UsuarioModel = require("../model/usuarios.model");
const Usuario = UsuarioModel(db, db.Sequelize);

const bcrypt = require('bcrypt');
const { escape } = require("mysql2");

exports.findById = async (id_usuario) => {
  try {
    const usuario = await Usuario.findByPk(id_usuario);
    return { success: true, data: usuario };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.findAll = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  try {
    const result = await Usuario.findAll({
      offset: paginacion === '' ? (page * rowsPerPage) : undefined,
      limit: paginacion === '' ? parseInt(rowsPerPage) : undefined,
      where: {
        nombre: {
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
      u.id_usuario, 
      u.nombre, 
      u.usuario, 
      u.password, 
      u.rol, 
      u.id_area as fkIdArea, 
      u.estado, 
      u.activo,
      a.id_area as idArea,
      a.nombre as nombreArea
    FROM haciendalavega_sistema.usuarios u
    LEFT JOIN haciendalavega_sistema.areas a ON a.id_area = u.id_area
    WHERE u.activo = 1
      AND CONCAT(u.nombre, ' ', u.usuario, ' ', u.rol, ' ', a.nombre) LIKE ('%' :busqueda '%')
  `;

  if (paginacion === "") {
    query += `
      ORDER BY u.id_usuario
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
  try {

    const hashedPassword = await bcrypt.hash(obj.password, 10);
    // Verificar duplicado por nombre o usuario
    const exists = await Usuario.findOne({
      where: {
        [Op.or]: [
          { nombre: obj.nombre },
          { usuario: obj.usuario }
        ],
        activo: true
      }
    });

    if (exists) {
      return { success: false, message: "Ya existe un usuario con este nombre y mismo usuario." };
    }

    // Crear el nuevo usuario
    const newUser = await Usuario.create({
      ...obj,
      password: hashedPassword,
      activo: true
    });

    return { success: true, data: newUser, created: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.updateByIdS = async (obj) => {
  try {
    const duplicate = await Usuario.findAll({
      where: {
        nombre: obj.nombre,
        activo: true,
        id_usuario: { [Op.not]: obj.id_usuario }
      }
    });

    if (duplicate.length > 0) {
      return { success: false, message: "Nombre duplicado" };
    }

    const updates = {
      nombre: obj.nombre,
      usuario: obj.usuario,
      rol: obj.rol,
      id_area: obj.id_area,
      estado: obj.estado,
    };


    if (obj.password && obj.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(obj.password, 10);
      updates.password = hashedPassword;
    }

    const result = await Usuario.update(
      updates,
      { where: { id_usuario: obj.id_usuario } }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


exports.deleteById = async (id_usuario) => {
  try {
    const result = await Usuario.update(
      { activo: false },
      { where: { id_usuario } }
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.login = async (usuario, password) => {
  console.log("-----Intento de login para usuario: ", usuario);
  try {
    // Buscar usuario por nombre de usuario
    const user = await Usuario.findOne({
      where: {
        usuario: usuario,
        activo: true
      }
    });

    if (!user) {
      return { success: false, message: "Usuario no encontrado" };
    }

    // Verificar contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: "Contraseña incorrecta" };
    }

    // Login exitoso - devolver datos del usuario sin la contraseña
    const userData = {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      usuario: user.usuario,
      rol: user.rol,
      id_area: user.id_area,
      estado: user.estado,
      activo: user.activo
    };

    return { success: true, data: userData, message: "Login exitoso" };
  } catch (error) {
    console.error("Error en login:", error);
    return { success: false, error: error.message };
  }
};
