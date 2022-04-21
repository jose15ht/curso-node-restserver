const { response } = require('express')
const jwt = require('jsonwebtoken')
const usuario = require('../models/usuario')
const Usuario = require('../models/usuario')

const validarJWT = async ( req, res = response, next) => {

    const token = req.header('xyz-token')

    if( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        
        const { uid }= jwt.verify( token, process.env.SECRETORPRIVATEKEY )

        // leer el usuario que corresponde al uid

        const usuarioAutenticado = await Usuario.findById( uid )


        if ( !usuarioAutenticado) {
            return res.status(401).json({
                msg: 'Token no válido - No tiene permisos'
            })
        }

        //verificar si el uid tiene estado true
        if ( !usuarioAutenticado.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario desactivado'
            })
        }

        //req.usuario = ??
        req.usuarioAuthorized = usuarioAutenticado



        next()

    } catch (error) {


        console.log(error)
        res.status(401).json({
            msg: 'Token no válido - modificado'
        })
    }


}



module.exports = {
    validarJWT
}