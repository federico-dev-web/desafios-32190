const express = require('express')
const fs = require('fs')
const Contenedor = require('./entregableManejoDeArchivos.js')
const { Router } = express


/// Creando contenedor 


const productos = new Contenedor('productos')


/////  Servidor

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(__dirname + '/public'))

const PORT = 8080

routerApi = new Router()

//devuelve todos los productos
routerApi.get('/productos', async (req, res) => {
    res.json(await productos.getAll())
})

//devuelve un producto según su id
routerApi.get('/productos/:id', async (req, res) => {
    let id = Number(req.params.id)
    if ( !(await productos.getAll()).find(el => el.id == id) ) {
        res.json({ "error" : 'producto no encontrado' })
    }
    res.json(await productos.getById( id ))    
})

//recibe y agrega un producto, y lo devuelve con su id asignado
routerApi.post('/productos', async (req, res) => {
    await productos.save(req.body)
    res.json( await productos.getById(Object.keys( await productos.getAll()).length) )
})

//recibe y actualiza un producto según su id
routerApi.put('/productos/:id', async (req, res, err) => {
    let id = Number(req.params.id)
    if ( !(await productos.getAll()).find(el => el.id == id) ) {
        res.json({ "error" : 'producto no encontrado' })
    }
    let obj = req.body
    obj.id = id
    await productos.changeById(obj, id)
    res.json({"ok": 'producto actualizado'})
})

//elimina un producto según su id
routerApi.delete('/productos/:id', async (req, res, err) => {
    let id = Number(req.params.id)
    if ( !(await productos.getAll()).find(el => el.id == id) ) {
        res.json({ "error" : 'producto no encontrado' })
    }
    await productos.deleteById(id)
    res.json({"ok": 'producto producto eliminado'})
})


/////

app.use('/api', routerApi)

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})


