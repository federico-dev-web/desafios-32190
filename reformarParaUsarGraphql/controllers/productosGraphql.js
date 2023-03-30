import productosServices from '../services/productosGraphql.js'

//--------------INCLUYENDO GRAPHQL----------------//

import { buildSchema } from 'graphql'
import { graphqlHTTP } from 'express-graphql'

const schema = buildSchema(`
type Producto {
    id: ID,
    title: String,
    price: Float,
    thumbnail: String
}
input ProductoInput {
    id: String,
    title: String,
    price: Float,
    thumbnail: String
}
type Query {
    getProducts: [Producto]
}
type Mutation {
    postProduct(datos: ProductoInput): Producto
    updateProduct(datos: ProductoInput): Producto
    deleteProduct(datos: ProductoInput): Producto
}
`)


export default class GraphqlController {
    constructor() {
        const api = new productosServices()
        return graphqlHTTP({
            schema: schema,
            rootValue: {
                getProducts: api.getProducts,
                postProduct: api.postProduct,
                deleteProduct: api.deleteProduct,
                updateProduct: api.updateProduct
            },
            graphiql: true
        })
    }
}