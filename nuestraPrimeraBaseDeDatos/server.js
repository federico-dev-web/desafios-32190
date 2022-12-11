import express from "express"
import { Router } from  "express"
import { createServer } from "http"
import { Server } from "socket.io"
import optionsMySql from "./options/mysqlconn.js"
import optionsSqlite3 from "./options/sqlite3conn.js"
import ClienteSQLProductos from "./sqlContainerProductos.js"
import ClienteSQLMensajes from "./sqlContainerMensajes.js"

const productos = new ClienteSQLProductos(optionsMySql)
const mensajes = new ClienteSQLMensajes(optionsSqlite3)

/////  Servidor
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('./public'))

const PORT = 8080

const routerApi = new Router()

app.set('views', './views')
app.set('view engine', 'pug')


//render inicial
app.get('/', async (req, res) => {
    res.render('formulario')
})

//websockets
io.on('connection', socket => {
    console.log('Un cliente se ha conectado')

    productos.listarProductos().then((prods) => { 
        return socket.emit('productos', prods)
    })

    mensajes.listarMensajes().then((mensjs) => { 
        return socket.emit('mensajes', mensjs)
    })

    socket.on('new-prod', nuevoProd => {
        productos.insertarProducto(nuevoProd).then(() => { 
            return productos.listarProductos()
        }).then((res) => { 
            return io.sockets.emit('productos', res)
        })
    })

    
    socket.on('new-msg', nuevoMsj => {
        mensajes.insertarMensaje(nuevoMsj).then(() => { 
            return mensajes.listarMensajes()
        }).then((res) => { 
            return io.sockets.emit('mensajes', res)
        })
    })
})


/////

//inicia el servidor

app.use(routerApi)

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})

