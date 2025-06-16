const express = require("express");
const router = express.Router();

// Controlador
const areaController = require("../controllers/area.controller");
// Middleware de autenticación, si lo usas
// const oauthController = require("../middleware/oauth.controller"); // Descomenta si aplica

router.get("/areas", areaController.findAll);
router.get("/areas/:id", areaController.findById);
router.post("/areas", areaController.create);
router.put("/areas/:id", areaController.updateByIdC);
router.delete("/areas/:id", areaController.deleteById);


module.exports = router;
