import mongoose from 'mongoose'
import * as models from "../models/mensajesNormalizados.js";
import dotenv from "dotenv"

dotenv.config({path: '.env'})

//conexion a la db local    


const conexion = async () => { 
    const URL = process.env.CONTAINER_MSJ_NORM_URL
    await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}


class mongoMensajesNorm {
    constructor(nombre){
        this.nombre = nombre
    }
    async insertarMensaje(mensaje) {
        //Devuelve todos los mensajes
        await conexion()
        await models.mensajes.deleteMany({})
        await models.mensajes.create( [ mensaje ] )
    }

    async listarMensajes() {
        await conexion()
        let res = await models.mensajes.find()
        return res
}
}

export default mongoMensajesNorm
