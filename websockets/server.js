const express = require('express')
const { Router } = express
const Contenedor = require('./entregableManejoDeArchivos.js')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')


/// Creando contenedores 
const productos = new Contenedor('productos')
const mensajes = new Contenedor('mensajes')

/////  Servidor
const app = express()
const httpServer = HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('./public'))

const PORT = 8080

routerApi = new Router()

app.set('views', './views')
app.set('view engine', 'pug')


//render inicial
app.get('/', async (req, res) => {
    res.render('formulario')
})

//websockets
io.on('connection', async socket => {
    console.log('Un cliente se ha conectado')

    socket.emit('productos')

    socket.emit('mensajes')

    socket.on('new-prod', async nuevoProd => {
        await productos.save(nuevoProd)
        io.sockets.emit('productos')
    })

    
    socket.on('new-msg', async nuevoMsj => {
        await mensajes.save(nuevoMsj)
        io.sockets.emit('mensajes')
    })
})


/////

//inicia el servidor

app.use(routerApi)

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})

