const express = require('express')
const fs = require('fs')

/// Incluyendo contenedor y leyendo el archivo de productos

class Contenedor {
    constructor(nombre){
        this.nombre = nombre
    }

    async getById(Number){
        //Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        try { 
            let contenido = await fs.promises.readFile(`${this.nombre}.txt`, 'utf-8')
            return ( JSON.parse(contenido).find(element => element.id == Number) ) 
        } catch (err) {
            console.log(null)
        }
    }

    async getAll() {
        //Devuelve un array con los objetos presentes en el archivo.
        try { 
            let contenido = await fs.promises.readFile(`${this.nombre}.txt`, 'utf-8')
            return JSON.parse(contenido)
        } catch (err) {
            console.log('El archivo no existe (getall)')
        }
    }
}

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



