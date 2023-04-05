import productosRepo from '../persistency/repository/productosRepo.js'

const productos = new productosRepo()

export default class productosServices {
    constructor() {
        
    }

    async getProducts () { 
        return await productos.getProducts()
    }
    
    async postProduct ( obj ) { 
        return await productos.postProduct( obj )
    }
    
    async updateProduct ( obj ) { 
        return await productos.updateProduct( obj )
    }
    
    async deleteProduct ( id ) { 
        return await productos.deleteProduct( id )
    }
    
}


