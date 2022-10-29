const fs = require('fs')


class Contenedor {
    constructor(nombre){
        this.nombre = nombre
    }

    async save(Object) {
        //Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try {
            let contenido = await fs.promises.readFile(`${this.nombre}.txt`, 'utf-8')
            let contenidoParseado =  JSON.parse( contenido )
            Object.id = Math.max( ...contenidoParseado.map(el => el.id) )  + 1 
            contenidoParseado.push(Object)
            try {
                await fs.promises.writeFile(`${this.nombre}.txt`, JSON.stringify(contenidoParseado))
                console.log(Object.id)
            } catch (err2) {
                console.log(err2)
            }
        } catch (err) {
            Object.id = 1
            let contenido = [Object]
            try {
                await fs.promises.writeFile(`${this.nombre}.txt`, JSON.stringify(contenido))
                console.log(Object.id)
            } catch (err) {
                console.log('El archivo no existe')
                console.log(err)
            }
        }
    }

    async getById(Number){
        //Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        try { 
            let contenido = await fs.promises.readFile(`${this.nombre}.txt`, 'utf-8')
            console.log( JSON.parse(contenido).find(element => element.id == Number) ) 
        } catch (err) {
            console.log(null)
        }
    }

    async getAll() {
        //Devuelve un array con los objetos presentes en el archivo.
        try { 
            let contenido = await fs.promises.readFile(`${this.nombre}.txt`, 'utf-8')
            console.log( JSON.parse(contenido) ) 
        } catch (err) {
            console.log('El archivo no existe (getall)')
        }
    }

    async deleteById(Number){
        //void - Elimina del archivo el objeto con el id buscado.
        try { 
            let contenido = await fs.promises.readFile(`${this.nombre}.txt`, 'utf-8')
            let contenidoNuevo =  JSON.parse(contenido).filter(element => element.id !== Number)             
            try {
                await fs.promises.writeFile(`${this.nombre}.txt`, JSON.stringify(contenidoNuevo))
            } catch (err2) {
                console.log(err2)
            } 
        } catch (err) {
            console.log('El archivo no existe')
        }
    }

    async deleteAll(){
        //void - Elimina todos los objetos presentes en el archivo.
        try {
            let contenido = await fs.promises.readFile(`${this.nombre}.txt`, 'utf-8')
            try {
                await fs.promises.writeFile(`${this.nombre}.txt`, '[]')
            } catch (err2) {
                console.log(err2)
            }
        } catch (err) {
            console.log('El archivo no existe');
            console.log(err)
        }
    }
}






const productos = new Contenedor('productos')

exampleObject ={                                                                                                                                                    
    title: 'Escuadra',                                                                                                                                 
    price: 123.45,                                                                                                                                     
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png'                                                                                                                                                                            
}

let testeo = async () => { 
    console.log('Creando el archivo con el primer objeto:')
    await productos.save(exampleObject)
    console.log('Ver contenido del archivo:')
    await productos.getAll()
    console.log('Agregando otro objeto:')
    await productos.save(exampleObject)
    console.log('Ver contenido del archivo:')
    await productos.getAll()
    console.log('Agregando otro objeto:')
    await productos.save(exampleObject)
    console.log('Ver contenido del archivo:')
    await productos.getAll()
    console.log('Ver el objeto de id = 1 del archivo:')
    await productos.getById(1)
    console.log('Ver el objeto de id = 2 del archivo:')
    await productos.getById(2)
    console.log('Borrando el objeto de id = 2 del archivo:')
    await productos.deleteById(2)
    console.log('Ver contenido del archivo:')
    await productos.getAll()
    console.log('Borrando el contenido completo del archivo:')
    await productos.deleteAll()
    console.log('Ver contenido del archivo:')
    await productos.getAll()
}

testeo()



