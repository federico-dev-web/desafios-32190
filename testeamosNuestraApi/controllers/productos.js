import * as productosServices from '../services/productos.js'

export const getProducts = async (req, res) => { 
    let prods = await productosServices.getProducts()
    res.json( prods )
}

export const postProduct = async (req, res) => { 
    let resp = await productosServices.postProduct( req.body )
    res.json( resp )
}

export const updateProduct = async (req, res) => { 
    if( !req.params.id) {
        res.json( {"error": "el producto no existe"} )
        return
    }
    let resp = await productosServices.updateProduct( req.body )
    res.json( resp )
}

export const deleteProduct = async (req, res) => { 
    if( !req.params.id) {
        res.json( {"error": "el producto no existe"} )
        return
    }
    let resp = await productosServices.deleteProduct( req.params.id )
    res.json( resp )
}
