export default class usuariosDTO {
    constructor( { _id, username, password } ) {
        this.id = _id,
        this.username = username,
        this.password = password
    }
}

export function transformarADTO(users) {
    if (Array.isArray(users)) {
        return users.map(p => new usuariosDTO(p))
    } else {
        return new usuariosDTO(users)
    }
}