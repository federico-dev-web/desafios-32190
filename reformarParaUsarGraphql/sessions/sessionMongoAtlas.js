import mongoStore from 'connect-mongo'
import dotenv from "dotenv"

dotenv.config({path: '../.env'})

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const sessionMongo =  {
    store: mongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/ecommerce',
        mongoOptions: advancedOptions
    }),
    secret: 'shhhhhh',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    },
    rolling: true
}

export { sessionMongo }

