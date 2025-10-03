const { Op } = require("sequelize");
const db = require("../config/db");
const IngresoModel = require("../model/ingreso.model");
const Ingreso = IngresoModel(db, db.Sequelize);
const { sendEmail } = require('../utils/email');
const HabitacionModel = require("../model/habitacion.model");
const Habitacion = HabitacionModel(db, db.Sequelize);

exports.findById = async (id_ingreso) => {
  try {
    const ingreso = await Ingreso.findByPk(id_ingreso);
    return { success: true, data: ingreso };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.findAll = async ({ busqueda = '', rowsPerPage = 10, page = 0, paginacion = '' }) => {
  try {
    const result = await Ingreso.findAll({
      offset: paginacion === '' ? (page * rowsPerPage) : undefined,
      limit: paginacion === '' ? parseInt(rowsPerPage) : undefined,
      where: {
        descripcion: {
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
      i.id_ingreso,
      i.id_area,
      i.descripcion,
      i.metodo,
      i.monto,
      i.fecha,
      i.activo,
      i.cantidad,
      i.monto as precio,
      a.id_area as idArea,
      a.nombre as nombreArea
    FROM haciendalavega_sistema.ingresos i
    LEFT JOIN haciendalavega_sistema.areas a ON a.id_area = i.id_area
    WHERE i.activo = 1
      AND CONCAT(i.descripcion, ' ', i.metodo, ' ', a.nombre) LIKE ('%' :busqueda '%')
  `;

  if (paginacion === "") {
    query += `
      ORDER BY i.id_ingreso DESC
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
    console.log("obj----: ", obj);
  try {
    const newIngreso = await Ingreso.create({
      ...obj,
      id_area: obj.idArea,
      descripcion: obj.descripcion,
      metodo: obj.metodo,
      monto: obj.precio,
      cantidad: obj.cantidad || 0,
      estado: obj.estado,
      fechaIngreso: obj.fechaInicio,
      fechaSalida: obj.fechaFin,
      fecha: obj.fecha || new Date(),
      activo: true
    });

    await exports.updateDisponibilidadHabitacion(obj.fechaInicio, obj.fechaFin, obj.idHabitacion);

    await sendEmail({
      to: 'crisrosar9@gmail.com',
      subject: 'Nuevo Ingreso Registrado',
      action: 'create',
      fields: { id_ingreso: newIngreso.id_ingreso, descripcion: newIngreso.descripcion, metodo: newIngreso.metodo, monto: newIngreso.monto, fecha: newIngreso.fecha,  cantidad: newIngreso.cantidad, fechaIngreso: newIngreso.fechaIngreso, fechaSalida: newIngreso.fechaSalida }
    });
    return { success: true, data: newIngreso, created: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.updateDisponibilidadHabitacion = async (fechaIngreso, fechaSalida, idHabitacion) => {
  console.log("fechaIngreso: ", fechaIngreso);
  console.log("fechaSalida: ", fechaSalida);
  console.log("idHabitacion: ", idHabitacion);

  try {
    // Verificar que se proporcionó el ID de habitación
    if (!idHabitacion) {
      console.log("No se proporcionó ID de habitación");
      return { success: false, message: "ID de habitación es requerido" };
    }

    // Buscar la habitación específica
    const habitacion = await Habitacion.findOne({
      where: {
        id_habitacion: idHabitacion,
        activo: true
      }
    });

    if (!habitacion) {
      console.log("Habitación no encontrada o inactiva");
      return { success: false, message: "Habitación no encontrada o inactiva" };
    }

    // Verificar si la habitación está disponible
    if (habitacion.disponible !== 1) {
      console.log("La habitación no está disponible");
      return { success: false, message: "La habitación no está disponible" };
    }

    console.log("Habitación seleccionada:", habitacion.id_habitacion, "- Nombre:", habitacion.nombre);

    // Marcar la habitación como ocupada (disponible = 2)
    await Habitacion.update(
      { disponible: 2 },
      { where: { id_habitacion: idHabitacion } }
    );

    console.log(`Habitación ${idHabitacion} marcada como ocupada`);

    // Programar la liberación de la habitación el día siguiente a las 11:00 AM

    const [year, month, day] = fechaSalida.split('-').map(Number);
    const fechaSalidaDate = new Date(year, month - 1, day);
    

    const CHECKOUT_HOUR = 11; 
    const CHECKOUT_MINUTE = 0; 
    
    // Crear la fecha de liberación: día DESPUÉS de la fecha de salida a la hora configurada
    const fechaLiberacion = new Date(fechaSalidaDate);
    fechaLiberacion.setDate(fechaLiberacion.getDate() + 1); 
    fechaLiberacion.setHours(CHECKOUT_HOUR, CHECKOUT_MINUTE, 0, 0); 
    
    const ahora = new Date();
    const tiempoHastaLiberacion = fechaLiberacion.getTime() - ahora.getTime();
    console.log("tiempoHastaLiberacion------: ", tiempoHastaLiberacion);


    const horaCheckout = `${CHECKOUT_HOUR.toString().padStart(2, '0')}:${CHECKOUT_MINUTE.toString().padStart(2, '0')}`;

    console.log(`Fecha de salida parseada: ${fechaSalidaDate.toLocaleDateString()}`);
    console.log(`Fecha de liberación calculada: ${fechaLiberacion.toLocaleString()}`);

    if (tiempoHastaLiberacion > 0) {
      setTimeout(async () => {
        try {
          await Habitacion.update(
            { disponible: 1 },
            { where: { id_habitacion: idHabitacion } }
          );
          console.log(`Habitación ${idHabitacion} liberada automáticamente a las ${horaCheckout}`);
        } catch (error) {
          console.error("Error al liberar habitación:", error);
        }
      }, tiempoHastaLiberacion);

      console.log(`Habitación ${idHabitacion} se liberará automáticamente el ${fechaLiberacion.toLocaleDateString()} a las ${horaCheckout}`);
    } else {
      // Si la fecha de liberación ya pasó, liberar inmediatamente
      await Habitacion.update(
        { disponible: 1 },
        { where: { id_habitacion: idHabitacion } }
      );
      console.log(`Habitación ${idHabitacion} liberada inmediatamente (fecha de liberación ya pasó)`);
    }

    return { 
      success: true, 
      habitacionAsignada: idHabitacion,
      message: "Habitación asignada correctamente"
    };

  } catch (error) {
    console.error("Error en updateDisponibilidadHabitacion:", error);
    return { success: false, error: error.message };
  }
}

exports.updateByIdS = async (obj) => {
  console.log("obj edit...: ", obj);
  try {
    const updates = {
      descripcion: obj.descripcion,
      metodo: obj.metodo,
      monto: obj.precio,
      fecha: obj.fecha,
      cantidad: obj.cantidad ? obj.cantidad : 0,
      fechaIngreso: obj.fechaInicio,
      fechaSalida: obj.fechaFin,
      id_area: obj.id_area
    };

    const result = await Ingreso.update(
      updates,
      { where: { id_ingreso: obj.id_ingreso } }
    );
    await sendEmail({
      to: 'crisrosar9@gmail.com',
      subject: 'Ingreso Actualizado',
      action: 'update',
      fields: { id_ingreso: obj.id_ingreso, descripcion: obj.descripcion, metodo: obj.metodo, monto: obj.monto, fecha: obj.fecha, cantidad: obj.cantidad, fechaIngreso: obj.fechaInicio, fechaSalida: obj.fechaFin }
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.deleteById = async (id_ingreso) => {
  try {
    const result = await Ingreso.update(
      { activo: false },
      { where: { id_ingreso } }
    );
    await sendEmail({
      to: 'crisrosar9@gmail.com',
      subject: 'Ingreso Eliminado',
      action: 'delete',
      fields: { id_ingreso: id_ingreso }
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};