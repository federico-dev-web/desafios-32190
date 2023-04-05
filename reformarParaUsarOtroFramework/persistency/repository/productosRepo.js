import productosDaoFactory from "../factory/productosFactory.js";
//import { transformarADTO } from "../dto/mensajesNormalizadosDto.js";
//import mensajesNormalizados from "../model/mensajesModel.js";

export default class productosRepo {
    dao

    constructor() {
        this.dao = productosDaoFactory.getDao()
    }

    static getInstance() {
        if(!instance) {
            instance =  new productosRepo()
        }
        return instance
    }

    async getProducts () {
        let res = await this.dao.getProducts()
        return ( res )
    }

    async getOneProduct ( id ) {
        let res = await this.dao.getOneProduct( id )
        return ( res )
    }

    //incorporación de nuevos productos
    async postProduct ( prod ) {
        let res = await this.dao.postProduct( prod )
        return ( res )
    }
    //modificación de productos
    async updateProduct ( obj ) {
        let res = await this.dao.updateProduct( obj )
        return ( res )
    }
    //borrado de producto
    async deleteProduct ( id ) {
        let res = await this.dao.deleteProduct( id )
        return ( res )
    }
}