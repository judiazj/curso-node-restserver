const {Router} = require('express');
const {check} = require('express-validator')

const {validarJWT, validarCampos, esAdminRole} = require('../middlewares')
const { existeCategoriaPorId, productoExiste, existeProductoPorId } = require('../helpers/db-validators');

const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos');

const router = Router();

// Obtener productos -> publico
router.get('/', obtenerProductos);

// Obtener producto -> publico
router.get('/:id', [
    check('id', 'El producto debe ser un mongoID').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],obtenerProducto);

// Crear producto -> privado <- cualquiera con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('nombre').custom(productoExiste),
    check('categoria', 'La categoria debe ser un mongoID').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

// Actualizar producto -> privado <- cualquiera con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'El producto debe ser un mongoID').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('categoria', 'La categoria debe ser un mongoID').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
],actualizarProducto);

// Borrar producto -> privado <- usuario Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El producto debe ser un mongoID').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],borrarProducto);

module.exports = router