import dotenv from "dotenv"
import mongoMensajesNormDao from '../dao/mensajesNormalizadosDao.js'

dotenv.config({path: '.env'})

const URL = process.env.CONTAINER_MSJ_NORM_URL

const dao = new mongoMensajesNormDao( URL )

export default class mensajesDaoFactory{
    static getDao() {
        return dao
    }
    static getInstance() {
        if(!instance) {
            instance =  new mensajesDaoFactory()
        }
        return instance
    }
}