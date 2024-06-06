const {Categoria} = require('../models')

const obtenerCategorias = async(req, res) => {
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true}
    const populate = {
        path: 'usuario',
        select: 'nombre correo rol estado google'
    }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(desde)
            .limit(limite)
            .populate(populate)
    ])
    res.json({
        total,
        categorias
    })
}

// obtenerCategoria -> populate
const obtenerCategoria = async(req, res) => {
    const {id} = req.params;
    const populate = {
        path: 'usuario',
        select: 'nombre correo rol estado google'
    }
    const categoria = await Categoria.findById(id).populate(populate);
    res.json({
        categoria
    })
}

const crearCategoria = async(req, res) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre}); 

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    // Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);
}


const actualizarCategoria = async(req, res) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true})

    res.json(categoria)
}

// borrarCategoria -> estado:false
const borrarCategoria = async(req, res) => {
    const {id} = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});
    res.json(categoria);
}
 

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}