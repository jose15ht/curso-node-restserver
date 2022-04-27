const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto, obtenerProductos, actualizarProducto, obtenerProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoria, productoID } = require('../helpers/db-validators');

const { validarJWT, validarCampos, adminRole } = require('../middlewares')

const router = Router();

/**
 * {{url}}/api/productos
 */

router.get('/', obtenerProductos)


router.get(('/:id'), [
    check('id', 'No es un id de producto Mongo válido').isMongoId(),
    check('id').custom( productoID ),
    validarCampos
], obtenerProducto)


router.post(('/'), [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es una id de categoria válida').isMongoId(),
    check('categoria').custom( existeCategoria ),
    validarCampos
], crearProducto)


router.put(('/:id'), [
    validarJWT,
    check('id', 'No es un id de producto Mongo válido').isMongoId(),
    check('id').custom( productoID),
    validarCampos
], actualizarProducto)


router.delete(('/:id'), [
    validarJWT,
    adminRole,
    check('id', 'No es un id de producto Mongo válido').isMongoId(),
    check('id').custom( productoID ),
    validarCampos
], borrarProducto)


module.exports = router