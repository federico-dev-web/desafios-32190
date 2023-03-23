
import { expect } from "chai"
//import request from "supertest"
import axios from "axios"
import getFakeProd from "./tests/mocha/generador/productos.js"


const url = 'http://localhost:8080/productos/'

/* request = request('http://localhost:8080/productos') */
//variable para probar las rutas que requieren id
let idModify = ''
//variables para comparar respuestas
let postResponse = []
let putResponse = []

describe("test api endpoint /productos/", () => {
    describe("GET a productos", () => { 
        it('debería retornar estado 200 y retornar el array de productos', async () => { 
            let response = await axios(`${url}`)
            /* let response = await request.get() */
            expect(response.status).to.eql(200)
            expect(response.data).to.be.an('array')
        })
    })
    describe("POST a productos", () => { 
        it('debería retornar estado 200 y retornar el objeto insertado', async () => { 
            let prod = await getFakeProd()
            let response = await axios.post(`${url}`, prod )
            idModify = response.data[0]._id
            postResponse = response.data[0]
            expect(response.status).to.eql(200)
            expect(postResponse).to.be.an('object')
        })
    })
    describe("PUT a productos", () => { 
        it('debería retornar estado 200 y modificar el objeto insertado', async () => { 
            let newProd = await getFakeProd()
            newProd.id = idModify
            let response = await axios.put(`${url}${idModify}`, newProd )
            putResponse = response.data[0]
            expect(response.status).to.eql(200)
            expect(putResponse).to.not.be.eql(postResponse)
        })
    })
    describe("DELETE a productos", () => { 
        it('debería retornar estado 200', async () => { 
            let response = await axios.delete(`${url}${idModify}`)
            expect(response.status).to.eql(200)
        })
    })
})