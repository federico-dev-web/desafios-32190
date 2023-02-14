import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"

///// info de mensajes, productos y usuarios
import getFakeProds from "./controllers/testConFaker.js"
import mongoUsuariosYContrasenias from "./containers/mongoContainerUsuariosYContrasenias.js"
import mongoMensajesNorm from "./containers/mongoContainerMensajesNormalizados.js"

import { normalize, denormalize } from 'normalizr'
import { chat } from './models/normalizacionSchemas.js'
import { sessionMongo } from './sessions/sessionMongoAtlas.js'
import session from 'express-session'

import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from "bcrypt"

//Desafio clase 28 - 1 - dotenv y argumentos de linea de comandos
import dotenv from "dotenv"
import parseArgs from 'yargs/yargs'


//--Desafio clase 30

import os from 'os'

//--Desafio clase 32
import logger from "./loggers/loggers.js"
import compression from 'compression'

//--

const numCPUs = os.cpus().length


const getRandomNumbs = (cant) => { 
    let numbArray = []
    for (let i = 0; i < cant; i++) {
        numbArray.push( Math.ceil(Math.random()*1000) ) 
    }
    return numbArray
}


//--

dotenv.config({path: './.env'})

const yargs = parseArgs(process.argv.slice(2))

const { puerto, _ } = yargs
    .alias({
        p: 'puerto'
    })
    .default({
        puerto: 8080
    }).argv

const PORT = puerto

//creo contenedores
const productosTest = getFakeProds()
const mensajesMongoNorm = new mongoMensajesNorm()
const usuariosYContrasenias = new mongoUsuariosYContrasenias()
let env = ''

/////  Servidor
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('./public'))

//--Desafio clase 32
app.use(compression())
//--


//--------------------strategies----------------------//
passport.use('register', new LocalStrategy({
    passReqToCallback: true    
}, async (req, username, password, done) => {
    const { direccion } = req.body
    let usuarios = await usuariosYContrasenias.listarTodosLosUsuarios()
    const usuario = usuarios.find(usuario => usuario.username == username)
    if (usuario) {
        return done(null, false)
    }
    //b-crypt genera el hash desde la contraseña enviada por el usuario
    let hashedPass = bcrypt.hashSync(password, 10)

    const newUser = {
        username,
        password: hashedPass
    }
    
    await usuariosYContrasenias.insertarUsuario(newUser)

    done(null, newUser)
}))

passport.use('login', new LocalStrategy(async (username, password, done) => {
    
    let usuarios = await usuariosYContrasenias.listarTodosLosUsuarios()
    const usuario = usuarios.find(usuario => usuario.username == username)
    if (!usuario) {
        return done(null, false)
    }

    //b-crypt valida la contraseña
    let validPass = bcrypt.compareSync(password, usuario.password )

    if (!validPass) {
        return done(null, false)
    }

    return done(null, usuario)
}))

//------------------SERIALIZE--------------------------//

passport.serializeUser((user, done) => {
    done(null, user.username)
})

passport.deserializeUser( async (username, done) => {
    let usuarios = await usuariosYContrasenias.listarTodosLosUsuarios()
    const usuario = usuarios.find(usuario => usuario.username == username)
    done(null, usuario)
})

//---------------Sessions y views---------------------//

app.use(session(sessionMongo))

app.set('views', './views')
app.set('view engine', 'pug')

//-------------------PASSPORT INIT--------------------//
app.use(passport.initialize())
app.use(passport.session())


//--------------------RUTAS---------------------------//
//login
app.get('/login', async (req, res) => {
    logger.info('/login')
    if (await req.isAuthenticated()) {
        return res.redirect('/succesfull-login')
    }
    res.render('login')
})

app.post('/login',  passport.authenticate('login', { failureRedirect: '/fail-login', successRedirect: '/succesfull-login' }))

//register
app.get('/register', async (req, res) => {
    logger.info('/register')
    if (await req.isAuthenticated()) {
        return res.redirect('/succesfull-login')
    }
    res.render('register')
})

app.post('/register',await passport.authenticate('register', { failureRedirect: '/fail-register', successRedirect: '/login'}))

//render fail login
app.get('/fail-login', (req, res) => {
    logger.info('/fail-login')
    res.render('failLogin')
})

//render fail register
app.get('/fail-register', (req, res) => {
    logger.info('/fail-register')
    res.render('failRegister')
})

//render succesfull login
app.get('/succesfull-login', async (req, res) => {
    logger.info('/succesfull-login')
    if (await req.isAuthenticated()) {
        return res.render('loginExitoso', {user: req.user.username})
    } else {
        res.redirect('/login')
    }
})

//logout
app.get('/logout', (req, res) => {
    logger.info('/logout')
    req.logout(err => {
        res.redirect('/login')
    })
})

//Desafio clase 28 - 2 - datos en la ruta "/info"
app.get('/info', (req, res) => {
    logger.info('/info')
        res.send({
            'Argumentos de entrada': process.argv.slice(2),
            'Path de ejecución': process.execPath,
            'Nombre de la plataforma (sistema operativo)': process.platform,
            'Process id': process.pid,
            'Versión de node.js': process.version,
            'Carpeta del proyecto': process.cwd().split('/').pop(),
            'Memoria total reservada (rss)': process.memoryUsage(),
            'nucleos': numCPUs
        })
})

//Desafio clase 28 - 3 - ruta "/api/randoms"
app.get('/api/randoms', (req, res) => {
    logger.info('/api/randoms')
    const cant = req.query.cant ?? 100000000
    const numbers = getRandomNumbs(cant)
    console.log("aca");
    res.send( { 'msg': 'start', numbers } )
})

//Las demás rutas
app.get('*', (req, res) => {
    let currentRoute = req.headers.referer
    if(["http://localhost:8080/login","http://localhost:8080/register", "http://localhost:8080/fail-register", "http://localhost:8080/fail-login","http://localhost:8080/logout", "http://localhost:8080/info", "http://localhost:8080/succesfull-login"].includes(currentRoute)){
    
    } else {
        logger.warn( `invalid route: ${currentRoute}` )
    }

})

//--------------------websockets----------------------//

//websockets
io.on('connection', async socket => {
    //se envia listado de productos al front (condicional si es para el mock api o el original)
    socket.emit('productos', productosTest)
    //se envia listado de mensajes al front
    await mensajesMongoNorm.listarMensajes().then((mensjs) => { 
        return socket.emit('mensajes', mensjs)
    }).catch( err => { logger.error( `error productos: ${err}` ) })


    //se agrega un producto a la tabla
    socket.on('new-prod', async nuevoProd =>  {
        productosTest.push(nuevoProd)
        io.sockets.emit('productos', productosTest).catch( err => { logger.error( `error productos: ${err}` ) })
    })

    //evento que llega un nuevo mensaje de un cliente
    socket.on('new-msg', async nuevoMsj => {
        //agregado del nuevo mensaje al objeto mensajes desnormalizado
        const msjs = await mensajesMongoNorm.listarMensajes().catch( err => { logger.error( `error mensajes: ${err}` ) })
        const mensajes = {
            result: msjs[0].result,
            entities: msjs[0].entities
        }
        //desnormalizo para agregarle el objeto que viene del front
        const mensajesDenormalizado = denormalize(mensajes.result, chat, mensajes.entities)
        //agrego objeto
        mensajesDenormalizado.mensajes.push( nuevoMsj ).catch( err => { logger.error( `error mensajes: ${err}` ) })
        //normalizo chat completo
        const mensajesNormalizados = normalize(mensajesDenormalizado, chat )
        await mensajesMongoNorm.insertarMensaje(mensajesNormalizados).then(
            () => mensajesMongoNorm.listarMensajes()
            ).then((res) => 
            //se refresca listado de mensajes a todos los clientes
            io.sockets.emit('mensajes', res)
        ).catch( err => { logger.error( `error mensajes: ${err}` ) })
    })
})


//---------------------server-------------------------//

//inicia el servidor
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT} - PID: ${process.pid}`);
})