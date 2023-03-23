import { normalize, denormalize } from 'normalizr'
import logger from "../loggers/loggers.js"
import getFakeProds from "../controllers/testConFaker.js"
import { schema } from 'normalizr'
import mensajesRepo from '../persistency/repository/mensajesRepo.js'

//Inicio el objeto repo
const mensajesMongoNorm = new mensajesRepo()


//Defino schema de normalizacion/denomarlizacion
const author = new schema.Entity('author', {}, {idAttribute: 'email'});
const chat = new schema.Entity('chat', { 
    mensajes: [ { author } ]
})

//generacion de listadod e productos
const productosTest = getFakeProds()


const socketService =  async socket => {
    //se envia listado de productos al front (condicional si es para el mock api o el original)
    socket.emit('productos', productosTest)
    //se envia listado de mensajes al front
    await mensajesMongoNorm.listarMensajes().then((mensjs) => { 
        return socket.emit('mensajes', mensjs)
    }).catch( err => { logger.error( `error productos: ${err}` ) })
    //se agrega un producto a la tabla
    socket.on('new-prod', async (nuevoProd) =>  {
        productosTest.push(nuevoProd)
        io.sockets.emit('productos', productosTest)/* .catch( err => { logger.error( `error productos: ${err}` ) }) */
    } )
    //evento que llega un nuevo mensaje de un clientet
    socket.on('new-msg', async (nuevoMsj) => {
        //agregado del nuevo mensaje al objeto mensajes desnormalizado
        const msjs = await mensajesMongoNorm.listarMensajes()/* .catch( err => { logger.error( `error mensajes: ${err}` ) }) */
        const mensajes = {
            result: msjs[0].result,
            entities: msjs[0].entities
        }
        //desnormalizo para agregarle el objeto que viene del front
        const mensajesDenormalizado = denormalize(mensajes.result, chat, mensajes.entities)
        //agrego objeto
        mensajesDenormalizado.mensajes.push( nuevoMsj )/* .catch( err => { logger.error( `error mensajes: ${err}` ) }) */
        //normalizo chat completo
        const mensajesNormalizados = normalize(mensajesDenormalizado, chat )
        await mensajesMongoNorm.insertarMensaje(mensajesNormalizados).then(
            () => mensajesMongoNorm.listarMensajes()
            ).then((res) => 
            //se refresca listado de mensajes a todos los clientes
            io.sockets.emit('mensajes', res)
        )/* .catch( err => { logger.error( `error mensajes: ${err}` ) }) */
    } )
}

export { socketService }