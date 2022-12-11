import knex from 'knex'

class ClienteSQLProductos {

    constructor(options) {
        this.knex = knex(options)
    }

    crearTabla() {
        return this.knex.schema.dropTableIfExists('productos')
            .finally(() => {
                return this.knex.schema.createTable('productos', table => {
                    table.increments('id').primary()
                    table.string('title', 15).notNullable()
                    table.float('price')
                    table.string('thumbnail', 200).notNullable()
                })
            })
    }

    insertarProducto(producto) {
        return this.knex('productos').insert(producto)
    }

    listarProductos() {
        return this.knex('productos').select('*')
    }

    borrarProducto(id) {
        return this.knex.from('productos').where('id', '=', id).del()
    }

    actualizarStock(stock, id) {
        return this.knex.from("productos").where('id', '=', id).update({stock: stock})
    }

    close() {
        this.knex.destroy()
    }
}

export default ClienteSQLProductos