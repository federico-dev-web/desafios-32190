//import { Router } from "express";
import Router from "koa-router";
//import { info, randoms, otras } from '../controllers/otras.js'

import productosControllers from '../controllers/productos.js';



const routerProductos = new Router({prefix: '/productos'})

const productos = new productosControllers()

//--------------------RUTAS---------------------------//

//lectura de productos
routerProductos.get('/', productos.getProducts )

//incorporación de nuevos productos
routerProductos.post('/', productos.postProduct )
//modificación de productos
routerProductos.put('/:id', productos.updateProduct )
//borrado de producto
routerProductos.delete('/:id', productos.deleteProduct )


export { routerProductos }