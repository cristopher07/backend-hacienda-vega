const express = require("express");
const router = express.Router();

// Controlador
const areaController = require("../controllers/area.controller");
const menuController = require("../controllers/menu.controller")
// Middleware de autenticación, si lo usas
// const oauthController = require("../middleware/oauth.controller"); // Descomenta si aplica

router.get("/areas/all", areaController.findAll);
router.get("/areas/:id", areaController.findById);
router.post("/areas/add", areaController.create);
router.post("/areas/Update/:id", areaController.updateByIdC);
router.post("/areas/Delete/:id", areaController.deleteById);

router.get("/menus", menuController.findAll);
router.get("/menus/:id", menuController.findById);
router.post("/menus", menuController.create);
router.post("/menusUpdate/:id", menuController.updateByIdC);
router.post("/menusDelete/:id", menuController.deleteById);


module.exports = router;


