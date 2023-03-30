import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { socketService } from './services/sockets.js'
import { sessionMongo } from './sessions/sessionMongoAtlas.js'
import session from 'express-session'
import passport from 'passport'
import parseArgs from 'yargs/yargs'
import compression from 'compression'
import { routerLoginYRegister } from './routes/loginYRegister.js'
import { routerOtras } from './routes/otras.js'
import { routerProductos } from './routes/productos.js'
import { routerProductosGraphql } from './routes/productosConGraphql.js'



//--------------ARGUMENTOS POR CONSOLA----------------//

const yargs = parseArgs(process.argv.slice(2))
const { puerto, _ } = yargs.alias({p: 'puerto'}).default({puerto: 8080}).argv
const PORT = puerto


//-------------------CREANDO APP---------------------//

///// Servidor
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
app.use('/productos/', routerProductos)
app.use('/productosGraphql/', routerProductosGraphql)

//--------------------Websockets----------------------//

io.on('connection', socketService )

//---------------------Server-------------------------//

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT} - PID: ${process.pid}`);
})