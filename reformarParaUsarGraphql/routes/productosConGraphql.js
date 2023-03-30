import { Router } from "express";
//import { info, randoms, otras } from '../controllers/otras.js'

import GraphqlController from '../controllers/productosGraphql.js'


const routerProductosGraphql = new Router()

//--------------------RUTAS---------------------------//


routerProductosGraphql.use('/', new GraphqlController())


export { routerProductosGraphql }