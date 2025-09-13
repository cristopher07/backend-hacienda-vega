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
const habitacionController = require("../controllers/habitacion.controller");
const brazaleteController = require("../controllers/brazalete.controller");
// Middleware de autenticación, si lo usas
// const oauthController = require("../middleware/oauth.controller"); // Descomenta si aplica

router.get("/areas/all", areaController.findAll);
router.get("/areas/:id", areaController.findById);
router.post("/areas/add", areaController.create);
router.post("/areas/Update/:id", areaController.updateByIdC);
router.post("/areas/Delete/:id", areaController.deleteById);

router.get("/menus/all", menuController.findAll);
router.get("/menus/query", menuController.findAllQuery);
router.get("/menus/:id", menuController.findById);
router.post("/menus/add", menuController.create);
router.post("/menus/Update/:id", menuController.updateByIdC);
router.post("/menus/Delete/:id", menuController.deleteById);

router.get("/bebidas/all", bebidasController.findAll);
router.get("/bebidas/query", bebidasController.findAllQuery);
router.get("/bebidas/:id", bebidasController.findById);
router.post("/bebidas/add", bebidasController.create);
router.post("/bebidas/Update/:id", bebidasController.updateByIdC);
router.post("/bebidas/Delete/:id", bebidasController.deleteById);

router.get("/mesas/all", mesasController.findAll);
router.get("/mesas/query", mesasController.findAllQuery);
router.get("/mesas/:id", mesasController.findById);
router.post("/mesas/add", mesasController.create);
router.post("/mesas/Update/:id", mesasController.updateByIdC);
router.post("/mesas/Delete/:id", mesasController.deleteById);

router.get("/usuarios/all", usuariosController.findAll);
router.get("/usuarios/query", usuariosController.findAllQuery); 
router.get("/usuarios/:id", usuariosController.findById);
router.post("/usuarios/add", usuariosController.create);
router.post("/usuarios/Update/:id", usuariosController.updateByIdC);
router.post("/usuarios/Delete/:id", usuariosController.deleteById);
router.post("/usuarios/login", usuariosController.login);

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

router.get("/habitaciones/all", habitacionController.findAll);
router.get("/habitaciones/query", habitacionController.findAllQuery);
router.get("/habitaciones/:id", habitacionController.findById);
router.post("/habitaciones/add", habitacionController.create);
router.post("/habitaciones/Update/:id", habitacionController.updateByIdC);
router.post("/habitaciones/Delete/:id", habitacionController.deleteById);

router.get("/brazaletes/all", brazaleteController.findAll);
router.get("/brazaletes/query", brazaleteController.findAllQuery);
router.get("/brazaletes/:id", brazaleteController.findById);
router.post("/brazaletes/add", brazaleteController.create);
router.post("/brazaletes/Update/:id", brazaleteController.updateByIdC);
router.post("/brazaletes/Delete/:id", brazaleteController.deleteById);

module.exports = router;


