const { response } = require('express')
const Usuario = require('../models/usuario')

const bcryptjs = require('bcryptjs');

const usuariosGet = async (req, res = response) => {

    //const { q, nombre = 'No nombre', apikey, page = 1, limit} = req.query;  =>> ejemplo destructuracion query params
    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query)

    const [ total, usuarios ] = await Promise.all([ 
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })    
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol} = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} )

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt )

    await usuario.save()
    res.json({
        usuario
    })    
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body

    // TODO: validar contra base de datos
    if( password ) {

        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt )
    }

    const usuarioDB = await Usuario.findByIdAndUpdate( id, resto )

    res.json(usuarioDB)    
}

const usuariosPatch = (req, res = response) => {

    res.json({
        msg: "patch API"
    })    
}


const usuariosDelete = async (req, res = response) => {

    const { id } = req.params

    //Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete( id );

    //Cambio recomendado = cambiar estado

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false})

    res.json({
        id
    })    
}



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}