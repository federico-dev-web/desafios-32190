import dotenv from "dotenv"
import mongoUsuariosYContraseniasDao from '../dao/usuariosYContraseniasDao.js'

dotenv.config({path: '.env'})

const URL = process.env.CONTAINER_USER_PASS_URL

// URL es el connString
dotenv.config({path: '.env'})

const dao = new mongoUsuariosYContraseniasDao( URL )

export default class usuarioDaoFactory{
    static getDao() {
        return dao
    }
    static getInstance() {
        if(!instance) {
            instance =  new usuarioDaoFactory()
        }
        return instance
    }
}
