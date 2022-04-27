const { request , response} = require("express");
const { Categoria }  = require('../models')


//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async ( req = request, res = response ) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }


    const [ total, categorias ] = await Promise.all([
            Categoria.countDocuments( query ),
            Categoria.find(query)
                .populate('usuario', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
    ])

    res.json({
        categorias,
        total
    })

}

//obtenerCategoria - populate {}

const obtenerCategoria = async( req = request, res = response ) => {

    const { id } = req.params 

    const categoria = await Categoria.findById(id)
                                        .populate('usuario', 'nombre')

    res.json({
        categoria
    })


}


const crearCategoria =  async ( req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre })

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        })
    }

    //GEnerar la data a guardar
    const data = {
        nombre,
        usuario: req.usuarioAuthorized._id 
    }

    const categoria = new Categoria( data )

    //Guardar DB
    await categoria.save()

    res.status(201).json({
        categoria
    })

}

// actualizarCategoria

const actualizarCategoria = async( req = request, res = response) => {

    const { id } = req.params
    const { estado, usuario, ...data } = req.body
    // console.log( id, nombre , req.usuarioAuthorized)

    console.log(data)

    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuarioAuthorized._id;
    const nombreDB = await Categoria.findOne({ nombre: data.nombre })

    if ( nombreDB ) {
        return res.status(400).json({
            msg: `El nombre ingresado " ${nombreDB.nombre} " ya está siendo utilizado `
        })
    }

    // const data = {
    //     nombre,
    //     usuario: req.usuarioAuthorized._id
    // }

    const updateCat = await Categoria.findByIdAndUpdate(id, data, {new: true })

    res.json(updateCat)
}

// borrarCategoria -> estado: false

const deshabilitarCategoria = async( req = request, res = response ) => {

    const { id } = req.params

    const categoria = await Categoria.findByIdAndUpdate( id, {estado: false}, { new: true })

    res.json(categoria)
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    deshabilitarCategoria
}