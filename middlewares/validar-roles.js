const { response } = require("express")



const adminRole = ( req, res = response, next) => {

    if ( !req.usuarioAuthorized ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

    const { rol, nombre } = req.usuarioAuthorized 

    if ( rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ nombre } no es administrador. No puede hacer esto`
        })
    }


    next()



}


const tieneRol = ( ...roles ) => {
    return ( req, res = response, next) => {

        if ( !req.usuarioAuthorized ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        }

        if ( !roles.includes ( req.usuarioAuthorized.rol )) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            })
        }

        next()

    }

}



module.exports = {
    adminRole,
    tieneRol
}