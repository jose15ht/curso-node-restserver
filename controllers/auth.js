const { response } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

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

const googleSignIn = async ( req, res = response) =>  {
    
    
    
    try {

        const { id_token } = req.body
        console.log(id_token)

        const { nombre, img, correo } = await googleVerify(id_token)

        let usuario = await Usuario.findOne({ correo })

        if ( !usuario ) {

            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            }

            usuario = new Usuario( data );
            await usuario.save()
        }

        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        const token = await generarJWT( usuario.id )
        console.log(token)

        res.json({
            usuario,
            token
        })

    } catch (error) {

        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'El token de Google no se pudo verificar'
        })
    }
}



module.exports = {
    loginController,
    googleSignIn
}