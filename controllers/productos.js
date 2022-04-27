const { request, response } = require('express')
const { Producto, Categoria } = require('../models')


//obtenerProductos - paginado- total - populate
const obtenerProductos = async ( req = request, res = response ) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }


    const [ total, productos ] = await Promise.all([
            Producto.countDocuments( query ),
            Producto.find(query)
                .populate('usuario', 'nombre' )
                .populate('categoria', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })

}



//obtenerProducto - populate{}
const obtenerProducto = async ( req = request, res = response ) => {
    const { id } = req.params

    const producto = await Producto.findById(id)
                                    .populate('usuario', 'nombre')
                                    .populate('categoria', 'nombre')

    res.status(201).json(producto)
}



//crearProducto:
const crearProducto = async( req, res = response ) => {

    const { estado, usuario, ...body} = req.body
    
    

    const productoDB = await Producto.findOne({ nombre: body.nombre })
    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto "${ productoDB.nombre }" ya existe`
        })
    }
    


    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuarioAuthorized._id,
    }

    console.log(data)
    const producto = new Producto ( data )

    await producto.save()

    res.status(201).json({
        producto
    })

}

const actualizarProducto = async (req = request, res = response ) => {

    const { id } = req.params
    const { estado, usuario, categoria, ...data } = req.body

    if( data.nombre ){
        data.nombre = data.nombre.toUpperCase()
    }

    data.usuario = req.usuarioAuthorized._id


    const nombreDB = await Producto.findOne( { nombre: data.nombre })

    // if (nombreDB) {
    //     return res.status(400).json({
    //         msg: `El nombre ${nombreDB.nombre} ya está registrado`
    //     })
    // }

    const updateProducto = await Producto.findByIdAndUpdate( id, data, { new: true })

    res.status(201).json(updateProducto)
}

const borrarProducto = async( req = request, res = response) => {
    
    const { id } = req.params

    const producto = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true })

    res.json(producto)
}




module.exports = {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
}