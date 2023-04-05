import mongoose from 'mongoose'
import { transformarADTO } from '../dto/mensajesNormalizadosDto.js'

//Schema
const mensajesNormSchema = new mongoose.Schema({}, { strict: false })

//////

class mongoMensajesNormDao {
    constructor(connString){
        this.connString = connString
        this.mensajes = mongoose.model('mensajesnormalizados', mensajesNormSchema)
    }

    static getInstance() {
        if(!instance) {
            instance =  new mongoMensajesNormDao()
        }
        return instance
    }

    async init() {
        await mongoose.connect(this.connString, {useNewUrlParser: true, useUnifiedTopology: true})
    }

    async disconnect() {
        await mongoose.disconnect()
    }

    async insertarMensaje(mensaje) {
        //Devuelve todos los mensajes
        await this.mensajes.deleteMany({})
        await this.mensajes.create( [ mensaje ] )
    }

    async listarMensajes() {
        let res = await this.mensajes.find()
        return transformarADTO( res )
    }
}

export default mongoMensajesNormDao