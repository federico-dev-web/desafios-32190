import { Router } from "express";
import { info, randoms, otras } from '../controllers/otras.js'

const routerOtras = new Router()

//--------------------RUTAS---------------------------//
//Desafio clase 28 - 2 - datos en la ruta "/info"
routerOtras.get('/info', info )

//Desafio clase 28 - 3 - ruta "/api/randoms"
routerOtras.get('/api/randoms', randoms )

/* //Las demás rutas
routerOtras.get('*', otras )

 */
export { routerOtras }