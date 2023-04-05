import productosServices from '../services/productos.js'

const productos = new productosServices()

export default class productosControllers {
    constructor() {
        
    }

    async getProducts (ctx) { 
        let prods = await productos.getProducts()
        ctx.body = ( prods )
    }

    async postProduct (ctx) { 
        let resp = await productos.postProduct( ctx.request.body )
        ctx.body = ( resp )
    }

    async updateProduct (ctx) { 
        if( !ctx.params.id) {
            ctx.body = ( {"error": "el producto no existe"} )
            return
        }
        let resp = await productos.updateProduct( ctx.request.body )
        ctx.body = ( resp )
    }

    async deleteProduct (ctx) { 
        if( !ctx.params.id) {
            ctx.body = ( {"error": "el producto no existe"} )
            return
        }
        let resp = await productos.deleteProduct( ctx.params.id )
        ctx.body = ( resp )
    }
}