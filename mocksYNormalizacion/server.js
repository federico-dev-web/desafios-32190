import express from "express"
import { Router } from  "express"
import { createServer } from "http"
import { Server } from "socket.io"
import ClienteSQLProductos from "./containers/sqlContainerProductos.js"
import ClienteSQLMensajes from "./containers/sqlContainerMensajes.js"
import getFakeProds from "./controllers/testConFaker.js"
import optionsMySql from "./options/mysqlconn.js"
import optionsSqlite3 from "./options/sqlite3conn.js"
import mongoMensajes from "./containers/mongoContainerMensajes.js"
import mongoMensajesNorm from "./containers/mongoContainerMensajesNormalizados.js"
import { normalize, denormalize } from 'normalizr'
import { chat } from './models/normalizacionSchemas.js'


//creo contenedores
const productos = new ClienteSQLProductos(optionsMySql)
const productosTest = getFakeProds()
const mensajes = new ClienteSQLMensajes(optionsSqlite3)
const mensajesMongo = new mongoMensajes()
const mensajesMongoNorm = new mongoMensajesNorm()
let env = ''



/////  Servidor
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('./public'))

const PORT = 8080

app.set('views', './views')
app.set('view engine', 'pug')


///// Creado de routes

const routerApi = new Router()
const routerApiTest = new Router()

//render inicial
routerApi.get('/', async (req, res) => {
    res.render('formulario')
    env = 'prod'
})

//render test
routerApiTest.get('/', async (req, res) => {
    res.render('formularioTest')
    env = 'test'
})


//websockets
io.on('connection', async socket => {
    console.log('Un cliente se ha conectado')
    //se envia listado de productos al front (condicional si es para el mock api o el original)
    if (env == 'prod') {
        await productos.listarProductos().then((prods) => { 
            return socket.emit('productos', prods)
        })   
    } else {
        socket.emit('productos', productosTest)
    }
    //se envia listado de mensajes al front (condicional si es para el mock api o el original)
    if (env == 'prod') {
        await mensajes.listarMensajes().then((mensjs) => { 
            return socket.emit('mensajes', mensjs)
        })
    } else {
        await mensajesMongoNorm.listarMensajes().then((mensjs) => { 
            return socket.emit('mensajes', mensjs)
        })
    }


    //se agrega un producto a la tabla
    socket.on('new-prod', async nuevoProd =>  {
        if (condition) {
            await productos.insertarProducto(nuevoProd).then(() => { 
                return productos.listarProductos()
            }).then((res) => { 
                //se refresca listado de productos a todos los clientes
                return io.sockets.emit('productos', res)
            })
            
        } else {
            productosTest.push(nuevoProd)
            io.sockets.emit('productos', productosTest)
            
        }
    })

    //evento que llega un nuevo mensaje de un cliente
    socket.on('new-msg', async nuevoMsj => {
        if (env == 'prod') {
            await mensajes.insertarMensaje(nuevoMsj).then(() => { 
                return mensajes.listarMensajes()
            }).then((res) => { 
                //se refresca listado de mensajes a todos los clientes
                return io.sockets.emit('mensajes', res)
            })
        } else {
            //agregado del nuevo mensaje al objeto mensajes desnormalizado
            const msjs = await mensajesMongoNorm.listarMensajes()
            const mensajes = {
                result: msjs[0].result,
                entities: msjs[0].entities
            }
            //desnormalizo para agregarle el objeto que viene del front
            const mensajesDenormalizado = denormalize(mensajes.result, chat, mensajes.entities)
            //agrego objeto
            mensajesDenormalizado.mensajes.push( nuevoMsj )
            //normalizo chat completo
            const mensajesNormalizados = normalize(mensajesDenormalizado, chat )
            await mensajesMongoNorm.insertarMensaje(mensajesNormalizados).then(
                () => mensajesMongoNorm.listarMensajes()
                ).then((res) => 
                //se refresca listado de mensajes a todos los clientes
                io.sockets.emit('mensajes', res)
            )
        }
    })
})




/////

//agrego las routes al server
app.use('/', routerApi)
app.use('/api/productos-test/', routerApiTest)

//inicia el servidor
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})

