import productosServices from '../services/productos.js'

const productos = new productosServices()

export default class productosControllers {
    constructor() {
        
    }

    async getProducts (req, res) { 
        let prods = await productos.getProducts()
        res.json( prods )
    }

    async postProduct (req, res) { 
        let resp = await productos.postProduct( req.body )
        res.json( resp )
    }

    async updateProduct (req, res) { 
        if( !req.params.id) {
            res.json( {"error": "el producto no existe"} )
            return
        }
        let resp = await productos.updateProduct( req.body )
        res.json( resp )
    }

    async deleteProduct (req, res) { 
        if( !req.params.id) {
            res.json( {"error": "el producto no existe"} )
            return
        }
        let resp = await productos.deleteProduct( req.params.id )
        res.json( resp )
    }
}