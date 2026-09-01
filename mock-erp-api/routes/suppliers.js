const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliersController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       required:
 *         - nif
 *         - name
 *       properties:
 *         documentNumber:
 *           type: string
 *         name:
 *           type: string
 *         nif:
 *           type: string
 *         supplierType:
 *           type: string
 *         email:
 *           type: string
 *         iban:
 *           type: string
 *         requester:
 *           type: string
 *         documentDate:
 *           type: string
 *           format: date
 *         vatRegime:
 *           type: string
 *         country:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/suppliers:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: The supplier was successfully created
 *       400:
 *         description: Bad request (missing required fields)
 *       409:
 *         description: Conflict (NIF already exists)
 */
router.post('/', suppliersController.createSupplier);

/**
 * @swagger
 * /api/v1/suppliers:
 *   get:
 *     summary: Returns the list of all suppliers
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: The list of the suppliers
 */
router.get('/', suppliersController.getSuppliers);

/**
 * @swagger
 * /api/v1/suppliers/clear:
 *   post:
 *     summary: Clear all suppliers but keep the sequence counter
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: Suppliers cleared
 */
router.post('/clear', suppliersController.clearSuppliers);

/**
 * @swagger
 * /api/v1/suppliers/reset:
 *   post:
 *     summary: Reset environment (clear suppliers and sequence counter)
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: Environment reset
 */
router.post('/reset', suppliersController.resetEnvironment);

/**
 * @swagger
 * /api/v1/suppliers/{code}:
 *   get:
 *     summary: Get a supplier by ERP Code
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The supplier ERP Code
 *     responses:
 *       200:
 *         description: The supplier description by code
 *       404:
 *         description: Supplier not found
 *   delete:
 *     summary: Delete a supplier by ERP Code
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The supplier ERP Code
 *     responses:
 *       200:
 *         description: Supplier deleted
 *       404:
 *         description: Supplier not found
 */
router.get('/:code', suppliersController.getSupplierByCode);
router.delete('/:code', suppliersController.deleteSupplier);

module.exports = router;
