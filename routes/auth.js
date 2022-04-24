const { Router } = require('express');
const { check } = require('express-validator');
const { loginController, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], loginController);

router.post('/google', [
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);





module.exports = router