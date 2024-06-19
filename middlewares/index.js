const validaCampos = require('./validar-campos');
const validaJWT = require('./validar-jwt');
const validaRoles = require('./validar-roles');
const validaArchivoSubir = require('./validar-archivo')

module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles,
    ...validaArchivoSubir
}