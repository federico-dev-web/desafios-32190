export default class mensajesNormalizados {
    #entities
    #result

    constructor( {entities, result } ) {
        this.entities = entities
        this.result = result
    }
    
    get entities() { return this.#entities }

    get result() { return this.#result }

    set entities(entities) { 
        //if (!entities) throw new Error('"entities" es un campo requerido')
        this.#entities = entities
    }

    set result(result) { 
        //if (!result) throw new Error('"result" es un campo requerido')
        this.#result = result
    }
}