const express = require("express");
const router = express.Router();

// Controlador
const areaController = require("../controllers/area.controller");
const menuController = require("../controllers/menu.controller");
const bebidasController = require("../controllers/bebida.controller");
const mesasController = require("../controllers/mesa.controller");
const usuariosController = require("../controllers/usuarios.controller");
const inventarioController = require("../controllers/inventario.controller");
const solicitudController = require("../controllers/solicitud.controller");
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

router.get("/bebidas/all", bebidasController.findAll);
router.get("/bebidas/:id", bebidasController.findById);
router.post("/bebidas/add", bebidasController.create);
router.post("/bebidasUpdate/:id", bebidasController.updateByIdC);
router.post("/bebidasDelete/:id", bebidasController.deleteById);

router.get("/mesas", mesasController.findAll);
router.get("/mesas/:id", mesasController.findById);
router.post("/mesas", mesasController.create);
router.post("/mesasUpdate/:id", mesasController.updateByIdC);
router.post("/mesasDelete/:id", mesasController.deleteById);

router.get("/usuarios/all", usuariosController.findAll);
router.get("/usuarios/query", usuariosController.findAllQuery); 
router.get("/usuarios/:id", usuariosController.findById);
router.post("/usuarios/add", usuariosController.create);
router.post("/usuarios/Update/:id", usuariosController.updateByIdC);
router.post("/usuarios/Delete/:id", usuariosController.deleteById);

router.get("/inventario/all", inventarioController.findAll);
router.get("/inventario/query", inventarioController.findAllQuery); 
router.get("/inventario/:id", inventarioController.findById);
router.post("/inventario/add", inventarioController.create);
router.post("/inventario/Update/:id", inventarioController.updateByIdC);
router.post("/inventario/Delete/:id", inventarioController.deleteById);

router.get("/solicitudes/all", solicitudController.findAll);
router.get("/solicitudes/query", solicitudController.findAllQuery);
router.get("/solicitudes/:id", solicitudController.findById);
router.post("/solicitudes/add", solicitudController.create);
router.post("/solicitudes/Update/:id", solicitudController.updateByIdC);
router.post("/solicitudes/Delete/:id", solicitudController.deleteById);

module.exports = router;


