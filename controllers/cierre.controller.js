const {
  getResumenCaja,
  createCierre,
  findAll,
  listarCierres
} = require("../services/cierre.services");

exports.getResumenCaja = async (req, res) => {
  const result = await getResumenCaja(req.body);

  if (result.success) {
    res.status(200).json({ valid: true, data: result.data });
  } else {
    res.status(400).json({ valid: false, msg: "Error al obtener resumen" });
  }
};


exports.create = async (req, res) => {
  const result = await createCierre(req.body);

  if (result.success) {
    res.status(201).json({ valid: true, msg: "Cierre realizado correctamente" });
  } else {
    res.status(400).json({ valid: false, msg: "Error al cerrar caja" });
  }
};

exports.findAll = async (req, res) => {
  const result = await findAll(req.query);
  res.json({ valid: true, data: result.data });
};




exports.listarCierres = async (req, res) => {
  const result = await listarCierres(req.query);

  if (result.success) {
    res.status(200).json({
      valid: true,
      data: result.data,
      msg: "Cierres Obtenidos exitosamente"
    });
  } else {
    res.status(400).json({
      valid: false,
      msg: "Error al obtener cierres de caja"
    });
  }
};
