


const validaCampos = require('../middlewares/validarCampos')
const validarJWT = require('../middlewares/validar-jwt.js');
const validarRoles = require('../middlewares/validar-roles');



module.exports = {
    ...validaCampos, 
    ...validarJWT,
    ...validarRoles
}