import dotenv from "dotenv"
import productosDao from '../dao/productosDao.js'

dotenv.config({path: '.env'})

const URL = process.env.CONTAINER_MSJ_NORM_URL

const dao = new productosDao( URL )

export default class productosFactory{
    static getDao() {
        return dao
    }
    static getInstance() {
        if(!instance) {
            instance =  new productosFactory()
        }
        return instance
    }
}