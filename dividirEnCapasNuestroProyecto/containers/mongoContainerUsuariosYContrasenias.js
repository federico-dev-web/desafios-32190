import mongoose from 'mongoose'
import * as models from "../models/usuariosYContrasenias.js"
import dotenv from "dotenv"

dotenv.config({path: '.env'})

//conexion a la db local    


const conexion = async () => { 
    const URL = process.env.CONTAINER_USER_PASS_URL
    await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}


class mongoUsuariosYContrasenias {
    constructor(nombre){
        this.nombre = nombre
    }
    async insertarUsuario(mensaje) {
        //inserta un usuario
        await conexion()
        await models.mensajes.create( [ mensaje ])
    }

    async listarTodosLosUsuarios() {
        await conexion()
        let res = await models.mensajes.find()
        return res
}
}

export default mongoUsuariosYContrasenias
