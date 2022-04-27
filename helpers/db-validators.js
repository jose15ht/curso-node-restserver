const { Producto } = require('../models')
const Categoria = require('../models/categoria')
const Role = require('../models/role')
const Usuario = require('../models/usuario')


const roleValido = async(rol = '') => {
    const  existeRol = await Role.findOne({ rol })
    if ( !existeRol ) {
        throw new Error(`El rol ${rol} no es válido: no existen en la BD`)
    }
}

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo ${correo} ya está registrado.`)
    }
}

const existeUsuarioID = async( id ) => {
    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario ) {
        throw new Error(`El usuario con id: ${id} no existe.`)
    }
}


/**
 * Validadores Categoria
 */

 const existeCategoria = async( id = '') => {

    const idCategoria = await Categoria.findById( id )

    if (!idCategoria) {
        throw new Error(`La categoría con id: ${id} no está registrada/no existe.`)
    }

}

const existeNombre = async( nombre = '' ) => {
    
    const nombreCat = await Categoria.findOne({ nombre })

    if ( nombreCat ) {
        throw new Error(`El nombre "${ nombre }" ya está siendo utilizado por una categoría `)
    }
}

/**
 * Validador id_producto
 */

 const productoID = async( id = '') => {

    const producto = await Producto.findById( id )

    if (!producto) {
        throw new Error(`La categoría con id: ${id} no está registrada/no existe.`)
    }

}


module.exports = {
    roleValido,
    emailExiste,
    existeUsuarioID,
    existeCategoria,
    existeNombre,
    productoID
}