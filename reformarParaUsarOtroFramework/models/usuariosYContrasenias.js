import mongoose from 'mongoose'

const mensajesCollectionName = 'usuariosycontrasenias'

const mensajesNormSchema = new mongoose.Schema({}, { strict: false })

export const mensajes = mongoose.model(mensajesCollectionName, mensajesNormSchema)