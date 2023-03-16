import mensajesDaoFactory from "../factory/mensajesFactory.js";
//import { transformarADTO } from "../dto/mensajesNormalizadosDto.js";
//import mensajesNormalizados from "../model/mensajesModel.js";

export default class mensajesRepo {
    dao

    constructor() {
        this.dao = mensajesDaoFactory.getDao()
    }

    async insertarMensaje(mensaje) {
        //Devuelve todos los mensajes
        await this.dao.deleteMany({})
        await this.dao.create( [ mensaje ] )
    }

    async listarMensajes() {
        await this.dao.init()
        let res = await this.dao.listarMensajes()
        return ( res )
    }
}