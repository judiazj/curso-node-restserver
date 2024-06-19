const { Categoria, Role, Usuario, Producto } = require('../models');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
    }
}

const emailExiste = async(correo = '') => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail) {
        throw new Error(`El correo: ${correo}, ya esta registrado `)
    }
}

const existeUsuarioPorId = async(id = '') => {
    // Verificar si el id existe
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario) {
        throw new Error(`El id no existe ${id}`)
    }
}

// Middlewares -> Categorias

const existeCategoriaPorId = async(id = '') => {
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){
        throw new Error(`La categoria con id ${id} no existe`)
    }
}

const categoriaExiste = async(categoria = '') => {
    const existeCategoria = await Categoria.findOne({nombre: categoria.toUpperCase()});
    if(existeCategoria){
        throw new Error(`La categoria ${categoria} ya esta en DB`)
    }
}

// Middlewares --> Productos
const existeProductoPorId = async(id = '') => {
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error(`El producto con id ${id} no existe`)
    }
}

const productoExiste = async(producto = '') => {
    const existeProducto = await Producto.findOne({nombre: producto.toUpperCase()});
    if(existeProducto){
        throw new Error(`El producto ${producto} ya esta en DB`);
    }
}

// Validar colecciones permitidas 
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    if(!colecciones.includes(coleccion)){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
    }   
    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    categoriaExiste,
    existeProductoPorId,
    productoExiste,
    coleccionesPermitidas
}