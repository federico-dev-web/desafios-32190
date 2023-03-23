import productosRepo from '../persistency/repository/productosRepo.js'

const productos = new productosRepo()

export const getProducts = async () => { 
    return await productos.getProducts()
}

export const postProduct = async ( obj ) => { 
    return await productos.postProduct( obj )
}

export const updateProduct = async ( obj ) => { 
    return await productos.updateProduct( obj )
}

export const deleteProduct = async ( id ) => { 
    return await productos.deleteProduct( id )
}
