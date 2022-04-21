const { response } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')

const loginController = async( req, res = response ) => {


    const { correo, password } = req.body
    

    try {

        //Verificar si email existe

        const usuario = await Usuario.findOne({ correo })
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        //Verificcar si usuario esta activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }

        //verificar contraseña

        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }


        // Generar JWT

        const token = await generarJWT( usuario.id )



        res.json({
            usuario,
            token
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).son({
            msg: 'Hable con el administrador'
        })
    }



}



module.exports = {
    loginController
}