const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/config');

class Server {
    
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            productos: '/api/productos',
            buscar: '/api/buscar',
            categorias: '/api/categorias'
        }
        
        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        // Cors
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio publico
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/user'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server on port ${this.port}`);
        });
    }
}


module.exports = Server;