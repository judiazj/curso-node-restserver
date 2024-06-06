const {Router} = require('express');
const {check} = require('express-validator');

const  {validarJWT, validarCampos, esAdminRole} = require('../middlewares');
const { existeCategoriaPorId, categoriaExiste } = require('../helpers/db-validators');
const { 
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias');

const router = Router();

// Obtener todas las categorias -> publico
router.get('/', obtenerCategorias);

// Obtener una categoria por id -> publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

// Crear categoria -> privado <- cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar categoria -> privado <- cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(categoriaExiste),
    validarCampos
], actualizarCategoria);

// Borrar categoria -> Admin 
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

module.exports = router