const express = require('express')
const handlebars = require('express-handlebars')
const Contenedor = require('./entregableManejoDeArchivos.js')
const { Router } = express


/// Creando contenedor 
const productos = new Contenedor('productos')


/////  Servidor
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

const PORT = 8080

routerApi = new Router()

app.engine('handlebars', handlebars.engine())

app.set('views', './viewsHandlebars')
app.set('view engine', 'handlebars')


//formulario de carga
app.get('/', (req, res) => {
    res.render('formulario')
})


//devuelve todos los productos
routerApi.get('/productos', async (req, res) => {
    const data = await productos.getAll()
    res.render('tabla', {data})
})


//recibe y agrega un producto, y lo devuelve con su id asignado
routerApi.post('/productos', async (req, res) => {
    console.log(req.body);
    await productos.save(req.body)
    res.redirect('/')
})


/////

app.use(routerApi)

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})


