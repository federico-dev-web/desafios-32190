export default class mensajesDTO {
    constructor({ entities, result }) {
        this.entities = entities,
        this.result = result
    }
}

export function transformarADTO(msj) {
    if (Array.isArray(msj)) {
        return msj.map(m => new mensajesDTO(m))
    } else {
        return new mensajesDTO(msj)
    }
}