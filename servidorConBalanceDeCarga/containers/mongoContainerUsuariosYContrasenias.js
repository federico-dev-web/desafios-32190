import mongoose from 'mongoose'
import * as models from "../models/usuariosYContrasenias.js"


const conexion = async () => { 
    const URL = "mongodb://127.0.0.1:27017/ecommerce"
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
        mongoose.disconnect()
    }

    async listarTodosLosUsuarios() {
        await conexion()
        let res = await models.mensajes.find()
        mongoose.disconnect()
        return res
}
}

export default mongoUsuariosYContrasenias
