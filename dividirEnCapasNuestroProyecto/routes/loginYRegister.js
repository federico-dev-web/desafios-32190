import { Router } from "express";
import * as controllersLogin from '../controllers/loginYRegister.js'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import mongoUsuariosYContrasenias from '../containers/mongoContainerUsuariosYContrasenias.js'
import bcrypt from "bcrypt"

const usuariosYContrasenias = new mongoUsuariosYContrasenias()
const routerLoginYRegister = new Router()



//---------------       RUTAS     --------------------//


//login
routerLoginYRegister.get('/login', controllersLogin.login )

routerLoginYRegister.post('/login',  passport.authenticate('login', { failureRedirect: '/fail-login', successRedirect: '/succesfull-login' }) )

//register
routerLoginYRegister.get('/register', controllersLogin.register )

routerLoginYRegister.post('/register', passport.authenticate('register', { failureRedirect: '/fail-register', successRedirect: '/login'}) )

//render fail login
routerLoginYRegister.get('/fail-login', controllersLogin.failLogin )

//render fail register
routerLoginYRegister.get('/fail-register', controllersLogin.failRegister )

//render succesfull login
routerLoginYRegister.get('/succesfull-login', controllersLogin.succesfullLogin )

//logout
routerLoginYRegister.get('/logout', controllersLogin.logout )


export { routerLoginYRegister }



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
