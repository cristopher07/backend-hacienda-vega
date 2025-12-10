const { getDashboardResumen } = require("../services/dashboard.services");

exports.getDashboardResumen = async (req, res) => {
  try {
    const result = await getDashboardResumen();

    if (result.success) {
      return res.status(200).json({
        valid: true,
        data: result.data
      });
    }

    res.status(400).json({
      valid: false,
      msg: "No se pudo obtener el resumen del dashboard"
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      valid: false,
      msg: "Error interno del servidor"
    });
  }
};
