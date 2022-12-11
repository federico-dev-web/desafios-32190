import ClienteSQLProductos from "./sqlContainerProductos.js"
import ClienteSQLMensajes from "./sqlContainerMensajes.js"
import optionsMySql from "./options/mysqlconn.js"
import optionsSqlite3 from "./options/sqlite3conn.js"

const productos = new ClienteSQLProductos(optionsMySql)
const mensajes = new ClienteSQLMensajes(optionsSqlite3)


const histMensajes = [
    {"email":"fede@fede.com","fyh":"2022-11-26T21:20:48.467Z","mensaje":"Hola!!","id":1},
    {"email":"daniel@daniel.com","fyh":"2022-11-26T21:21:14.021Z","mensaje":"como va?","id":2},
    {"email":"jorge@jorge.com","fyh":"2022-11-26T21:25:54.686Z","mensaje":"Todo bien, ustedes?","id":3}
]

const histProductos = [
    {"title":"Escuadra",
    "price":123.45,
    "thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
    "id":1
    },
    {"title":"Calculadora",
    "price":234.56,
    "thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png","id":2
    },
    {"title":"Globo Terráqueo",
    "price":345.67,
    "thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
    "id":3}
]

productos.crearTabla()
    .then(()=>{
        return productos.insertarProducto(histProductos)
    }).finally(()=>{
        productos.close()
    })


mensajes.crearTabla()
    .then(()=>{
        return mensajes.insertarMensaje(histMensajes)
    }).finally(()=>{
        mensajes.close()
    })