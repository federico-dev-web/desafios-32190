import { Router } from "express";
import * as controllersLogin from '../controllers/loginYRegister.js'
import passport from 'passport'
import * as passportServices from '../services/passportServices.js'


//--------------------strategies----------------------//

passport.use('register', passportServices.registerStrategy )
passport.use('login', passportServices.loginStrategy  ) 

//------------------SERIALIZE--------------------------//

passport.serializeUser(  (user, done) => { done(null, user.username) }  )
passport.deserializeUser( passportServices.deserializaerCallback )


//---------------       RUTAS     --------------------//

const routerLoginYRegister = new Router()

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