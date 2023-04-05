import { getRandomNumbs } from '../services/otras.js'
import logger from '../loggers/loggers.js'
import os from 'os'
const numCPUs = os.cpus().length

export const info = ctx => {
    logger.info('/info')
        ctx.body = ({
            'Argumentos de entrada': process.argv.slice(2),
            'Path de ejecución': process.execPath,
            'Nombre de la plataforma (sistema operativo)': process.platform,
            'Process id': process.pid,
            'Versión de node.js': process.version,
            'Carpeta del proyecto': process.cwd().split('/').pop(),
            'Memoria total reservada (rss)': process.memoryUsage(),
            'nucleos': numCPUs
        })
}

export const randoms = ctx => {
    logger.info('/api/randoms')
    const cant = req.query.cant ?? 100000000
    const numbers = getRandomNumbs(cant)
    ctx.body = ( { 'msg': 'start', numbers } )
}

export const otras = ctx => {
    let currentRoute = ctx.header.referer
    if(["http://localhost:8080/login","http://localhost:8080/register", "http://localhost:8080/fail-register", "http://localhost:8080/fail-login","http://localhost:8080/logout", "http://localhost:8080/info", "http://localhost:8080/succesfull-login"].includes(currentRoute)){
    
    } else {
        logger.warn( `invalid route: ${currentRoute}` )
    }

}