import mongoStore from 'connect-mongo'
import dotenv from "dotenv"

dotenv.config({path: '../.env'})

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const sessionMongo =  {
    store: mongoStore.create({
        mongoUrl: process.env.SESSION_MONGO_URL,
        mongoOptions: advancedOptions
    }),
    secret: process.env.SESSION_MONGO_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    },
    rolling: true
}

export { sessionMongo }

