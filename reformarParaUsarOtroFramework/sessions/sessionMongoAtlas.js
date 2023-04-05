import mongoStore from 'koa-session-mongo'
import MongooseStore from 'koa-session-mongoose'
import dotenv from "dotenv"


dotenv.config({path: '../.env'})

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const sessionMongo =  new MongooseStore({
    store: mongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/ecommerce',
        db: 'ecommerce',
        mongoOptions: advancedOptions
    }),
    secret: 'shhhhhh',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    },
    rolling: true
})


export { sessionMongo }

