import usuarioDaoFactory from "../factory/usuariosFactory.js";
//import { transformarADTO } from "../dto/usuariosYContraseniasDto.js";
//import usuariosYContrasenias from "../model/usuariosModel.js";

export default class usuariosRepo {
    dao

    constructor() {
        this.dao = usuarioDaoFactory.getDao()
    }

    async insertarUsuario(user) {
        await this.dao.insertarUsuario( user )
    }

    async listarTodosLosUsuarios() {
        await this.dao.init()
        let res = await this.dao.listarTodosLosUsuarios()
        return ( res )
    }
}