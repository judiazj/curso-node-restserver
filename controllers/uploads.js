const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models')

const cargarArchivo = async (req, res) => {

    try {
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombre })

    } catch (msg) {
        res.status(400).json({ msg })
    }

}

const actualizarImagen = async (req, res) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            break;
        default:
            res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    if (!modelo) {
        return res.status(400).json({
            msg: `No existe un producto con el id ${id}`
        })
    }

    // Limpiar imagenes previas
    if(modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img); 
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen)
        }
    }

    modelo.img = await subirArchivo(req.files, undefined, coleccion);
    await modelo.save();


    res.json(modelo);
}

const actualizarImagenCloudinary = async (req, res) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            break;
        default:
            res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    if (!modelo) {
        return res.status(400).json({
            msg: `No existe un producto con el id ${id}`
        })
    }

    // Limpiar imagenes previas
    if(modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;
    await modelo.save();


    res.json(modelo);
}

const mostrarImagen = async(req, res) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            break;
        default:
            res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    if (!modelo) {
        return res.status(400).json({
            msg: `No existe un producto con el id ${id}`
        })
    }

    // Limpiar imagenes previas
    if(modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img); 
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen);
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(pathImagen)
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}