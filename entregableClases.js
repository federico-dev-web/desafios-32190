
class Usuario {
    constructor( nombre, apellido, libros, mascotas ) {
        this.nombre = nombre
        this.apellido = apellido
        this.libros = libros
        this.mascotas = mascotas
    }

        
    getFullName() {
        console.log(` ${this.nombre} ${this.apellido} `)
    } 

    addMascota(string) { 
        this.mascotas.push(string)
    }

    countMascotas() { 
        console.log(this.mascotas.length);
    }

    addBook(nombre, autor) { 
        let obj = {nombre: nombre, autor: autor}
        this.libros.push(obj)
    }

    getBookNames() { 
        let arreglo = []
        this.libros.forEach( element => { arreglo.push(element.nombre) } )
        console.log(arreglo);
    }
}

const usuario1 = new Usuario(
    'Lionel', 
    'Messi', 
    [
        {nombre: 'El señor de las moscas',autor: 'William Golding'}, 
        {nombre: 'Fundacion', autor: 'Isaac Asimov'}
    ],
    ['perro', 'gato']
)

console.log('Nombre completo:')
usuario1.getFullName()
console.log('Cantidad inicial de mascotas:')
usuario1.countMascotas()
usuario1.addMascota('araña')
console.log('Cantidad de mascotas despues de agregar una:')
usuario1.countMascotas()
console.log('Nombres de libros al inicio:')
usuario1.getBookNames()
usuario1.addBook('La Biblia','Los Apostoles')
console.log('Nombres de libros despues de agregar uno:')
usuario1.getBookNames()



