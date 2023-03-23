import { Router } from "express";
//import { info, randoms, otras } from '../controllers/otras.js'

import {getProducts, postProduct, updateProduct, deleteProduct} from '../controllers/productos.js';


const routerProductos = new Router()

//--------------------RUTAS---------------------------//

//lectura de productos
routerProductos.get('/', getProducts )

//incorporación de nuevos productos
routerProductos.post('/', postProduct )
//modificación de productos
routerProductos.put('/:id', updateProduct )
//borrado de producto
routerProductos.delete('/:id', deleteProduct )


export { routerProductos }