export default class productosDTO {
    constructor({ title, price, thumbnail, _id }) {
        this.title = title,
        this.price = price,
        this.thumbnail = thumbnail,
        this.id = _id
    }
}

export function transformarADTO(prod) {
    if (Array.isArray(prod)) {
        return prod.map(p => new productosDTO(p))
    } else {
        return new productosDTO(prod)
    }
}