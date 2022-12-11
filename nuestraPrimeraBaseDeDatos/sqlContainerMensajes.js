import knex from 'knex'

class ClienteSQLMensajes {

    constructor(options) {
        this.knex = knex(options)
    }

    crearTabla() {
        return this.knex.schema.dropTableIfExists('mensajes')
            .finally(() => {
                return this.knex.schema.createTable('mensajes', table => {
                    table.increments('id').primary()
                    table.string('email', 30).notNullable()
                    table.string('mensaje', 300).notNullable()
                    table.string('fyh', 30).notNullable()
                })
            })
    }

    insertarMensaje(mensaje) {
        return this.knex('mensajes').insert(mensaje)
    }

    listarMensajes() {
        return this.knex('mensajes').select('*')
    }

    borrarMensaje(id) {
        return this.knex.from('mensajes').where('id', '=', id).del()
    }

    close() {
        this.knex.destroy()
    }
}

export default ClienteSQLMensajes