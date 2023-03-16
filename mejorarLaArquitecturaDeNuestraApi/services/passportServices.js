import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from "bcrypt"
import usuariosRepo from '../persistency/repository/usuariosRepo.js'

const usuariosYContrasenias = new usuariosRepo()

export const registerStrategy = new LocalStrategy({
        passReqToCallback: true    
    }, 
    async (req, username, password, done) => {
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
    }
)

export const loginStrategy = new LocalStrategy(async (username, password, done) => {
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
    }
)


export const deserializaerCallback = async (username, done) => {
    let usuarios = await usuariosYContrasenias.listarTodosLosUsuarios()
    const usuario = usuarios.find(usuario => usuario.username == username)
    done(null, usuario)
}