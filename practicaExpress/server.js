const express = require('express')
const fs = require('fs')
const Contenedor = require('./entregableManejoDeArchivos.js')


/// Creando contenedor 


const productos = new Contenedor('productos')


/////  Servidor

const app = express()

const PORT = 8080

app.get('/', (req, res) => {
    res.send('<h1>hola mundo</h1>')
})

app.get('/productos', async (req, res) => {
    res.send( await productos.getAll() )
})

app.get('/productoRandom', async (req, res) => {
    let largo = Object.keys( await productos.getAll()).length
    let valor = Math.ceil( Math.random()*largo )
    res.send( await productos.getById(valor) ) 
})


const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
    }
)



