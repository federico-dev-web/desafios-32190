//import { Router } from "express";
import Router from "koa-router";
//import { info, randoms, otras } from '../controllers/otras.js'

import GraphqlController from '../controllers/productosGraphql.js'


const routerProductosGraphql = new Router({prefix: '/productosGraphql'})


//--------------------RUTAS---------------------------//


routerProductosGraphql.get('/', new GraphqlController())


export { routerProductosGraphql }