const {Producto} = require('../models')

const obtenerProductos = async(req, res) => {
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ])

    res.json({
        total,
        productos
    })
}

const obtenerProducto = async(req, res) => {
    const {id} = req.params;
    const producto = await Producto.findById(id)
                                    .populate('usuario', 'nombre')
                                    .populate('categoria', 'nombre');
    
    res.json(producto);
}

const crearProducto = async(req, res) => {
    const {estado, usuario, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();

    const productoDB = await Producto.findOne({nombre: data.nombre});
    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        })
    }
    
    data.usuario = req.usuario._id
    const producto = new Producto(data);

    // Guardar en DB
    await producto.save();

    res.status(201).json(producto);
}

const actualizarProducto = async(req, res) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto)
}

const borrarProducto = async(req, res) => {
    const {id} = req.params;
    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: false});
    res.json(producto);
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}