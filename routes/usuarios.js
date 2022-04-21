const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');

// const { validarCampos } = require('../middlewares/validarCampos')
// const { validarJWT } = require('../middlewares/validar-jwt.js');
// const { adminRole, tieneRol } = require('../middlewares/validar-roles');

const { validarCampos, validarJWT, adminRole, tieneRol } = require('../middlewares')

const { roleValido, emailExiste, existeUsuarioID } = require('../helpers/db-validators');


const router = Router();


router.get('/', usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),  coleecionb roles en duro
    check('rol').custom( roleValido ),
    validarCampos
], usuariosPost);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioID ),
    check('rol').custom( roleValido ),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch)

router.delete('/:id',[
    validarJWT,
    //adminRole,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioID ),
    validarCampos
], usuariosDelete);

module.exports = router;