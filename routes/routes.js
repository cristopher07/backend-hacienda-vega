const express = require("express");
const router = express.Router();

// Controlador
const areaController = require("../controllers/area.controller");
// Middleware de autenticación, si lo usas
// const oauthController = require("../middleware/oauth.controller"); // Descomenta si aplica

/**
 * @swagger
 * /areas:
 *   get:
 *     summary: "Listar todas las áreas"
 *     tags: [ÁREAS]
 *     responses:
 *       200:
 *         description: Listado exitoso
 */
router.get("/areas", /* oauthController.verify, */ areaController.findAll);

/**
 * @swagger
 * /areas/:id:
 *   get:
 *     summary: "Obtener área por ID"
 *     tags: [ÁREAS]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Área encontrada
 */
router.get("/areas/:id", /* oauthController.verify, */ areaController.findById);

/**
 * @swagger
 * /areas:
 *   post:
 *     summary: "Crear nueva área"
 *     tags: [ÁREAS]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Área creada
 */
router.post("/areas", /* oauthController.verify, */ areaController.create);

/**
 * @swagger
 * /areas:
 *   put:
 *     summary: "Actualizar un área"
 *     tags: [ÁREAS]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Área actualizada
 */
router.put("/areas", /* oauthController.verify, */ areaController.updateById);

/**
 * @swagger
 * /areas/:id:
 *   delete:
 *     summary: "Eliminar un área (soft delete)"
 *     tags: [ÁREAS]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Área eliminada
 */
router.delete("/areas/:id", /* oauthController.verify, */ areaController.deleteById);

module.exports = router;
