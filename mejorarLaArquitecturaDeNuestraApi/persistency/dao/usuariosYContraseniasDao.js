import mongoose from 'mongoose'
import { transformarADTO } from '../dto/usuariosYContraseniasDto.js'

const usuariosSchema = new mongoose.Schema({}, { strict: false })

class mongoUsuariosYContraseniasDao {
    constructor(connString){
        this.connString = connString
        this.usuarios = mongoose.model('usuariosycontrasenias', usuariosSchema)
    }

    async init() {
        await mongoose.connect(this.connString, {useNewUrlParser: true, useUnifiedTopology: true})
    }

    async disconnect() {
        await mongoose.disconnect()
    }

    async insertarUsuario(user) {
        //inserta un usuario
        await this.usuarios.create( [ user ])
    }

    async listarTodosLosUsuarios() {
        let res = await this.usuarios.find()
        return transformarADTO( res )
    }
}


export default mongoUsuariosYContraseniasDao