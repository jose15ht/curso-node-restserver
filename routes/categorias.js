const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, deshabilitarCategoria} = require('../controllers/categorias');

const { existeCategoria, existeNombre} = require('../helpers/db-validators')

const { validarJWT, validarCampos, tieneRol, adminRole } = require('../middlewares');

const router = Router()

/**
 * {{url}}/api/categorias
 */

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias)

//Obtener categoria por id
router.get('/:id', [
    check('id', 'No es una id de categoría válida').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoria)


//Crear categoria - privado - cualquiera con token válido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

// Actualizar - privado -cualquira con token válido
router.put(('/:id'), [
    validarJWT,
    check('id', 'No es una id de categoría válida').isMongoId(),
    check('id').custom( existeCategoria ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom( existeNombre ),
    validarCampos    
], actualizarCategoria )

// Borrar categoria - Admin
router.delete(('/:id'), [
    validarJWT,
    adminRole,
    check('id', 'No es una id de categoría válida').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], deshabilitarCategoria)

module.exports = router;