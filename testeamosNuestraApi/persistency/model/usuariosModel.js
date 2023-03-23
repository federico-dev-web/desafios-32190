export default class usuariosYContrasenias {
    #id
    #username
    #password

    constructor( { _id, username, password } ) {
        this.id = _id,
        this.username = username,
        this.password = password
    }

    
    get id() { return this.#id }

    get username() { return this.#username }

    get password() { return this.#password }

    set id(id) { 
        //if (!_id) throw new Error('"entities" es un campo requerido')
        this.#id = id
    }

    set username(username) { 
        //if (!username) throw new Error('"username" es un campo requerido')
        this.#username = username
    }

    set password(password) { 
        //if (!password) throw new Error('"password" es un campo requerido')
        this.#password = password
    }
}