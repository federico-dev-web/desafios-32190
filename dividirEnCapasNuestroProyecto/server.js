import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { normalize, denormalize } from 'normalizr'
import { chat } from './models/normalizacionSchemas.js'
import getFakeProds from "./controllers/testConFaker.js"
import mongoMensajesNorm from "./containers/mongoContainerMensajesNormalizados.js"
import logger from "./loggers/loggers.js"

const mensajesMongoNorm = new mongoMensajesNorm()
const productosTest = getFakeProds()
/* 

*/
import { sessionMongo } from './sessions/sessionMongoAtlas.js'
import session from 'express-session'
import passport from 'passport'
/* 
import dotenv from "dotenv"
dotenv.config({path: './.env'}) 
*/
import parseArgs from 'yargs/yargs'
import compression from 'compression'

import { routerLoginYRegister } from './routes/loginYRegister.js'
import { routerOtras } from './routes/otras.js'

const yargs = parseArgs(process.argv.slice(2))
const { puerto, _ } = yargs.alias({p: 'puerto'}).default({puerto: 8080}).argv
const PORT = puerto


//-------------------CREANDO APP---------------------//

/////  Servidor
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('./public'))

app.use(compression())

app.use(session(sessionMongo))

app.set('views', './views')
app.set('view engine', 'pug')

//-------------------PASSPORT INIT--------------------//
app.use(passport.initialize())
app.use(passport.session())

//----------------------ROUTES------------------------//
app.use('/', routerLoginYRegister)
app.use('/', routerOtras)

//--------------------websockets----------------------//
//websockets
io.on('connection', async socket => {
    //se envia listado de productos al front (condicional si es para el mock api o el original)
    socket.emit('productos', productosTest)
    //se envia listado de mensajes al front
    await mensajesMongoNorm.listarMensajes().then((mensjs) => { 
        return socket.emit('mensajes', mensjs)
    }).catch( err => { logger.error( `error productos: ${err}` ) })
    //se agrega un producto a la tabla
    socket.on('new-prod', async (nuevoProd) =>  {
        productosTest.push(nuevoProd)
        io.sockets.emit('productos', productosTest)/* .catch( err => { logger.error( `error productos: ${err}` ) }) */
    } )
    //evento que llega un nuevo mensaje de un clientet
    socket.on('new-msg', async (nuevoMsj) => {
        //agregado del nuevo mensaje al objeto mensajes desnormalizado
        const msjs = await mensajesMongoNorm.listarMensajes()/* .catch( err => { logger.error( `error mensajes: ${err}` ) }) */
        const mensajes = {
            result: msjs[0].result,
            entities: msjs[0].entities
        }
        //desnormalizo para agregarle el objeto que viene del front
        const mensajesDenormalizado = denormalize(mensajes.result, chat, mensajes.entities)
        //agrego objeto
        mensajesDenormalizado.mensajes.push( nuevoMsj )/* .catch( err => { logger.error( `error mensajes: ${err}` ) }) */
        //normalizo chat completo
        const mensajesNormalizados = normalize(mensajesDenormalizado, chat )
        await mensajesMongoNorm.insertarMensaje(mensajesNormalizados).then(
            () => mensajesMongoNorm.listarMensajes()
            ).then((res) => 
            //se refresca listado de mensajes a todos los clientes
            io.sockets.emit('mensajes', res)
        )/* .catch( err => { logger.error( `error mensajes: ${err}` ) }) */
    } )
})


//---------------------server-------------------------//
//inicia el servidor
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT} - PID: ${process.pid}`);
})