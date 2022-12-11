
const socket = io()

//mensaje para volver a renderizar la tabla de productos (se ejecuta en la primer conexión y cuando se agrega un nuevo porducto por cualquier cliente)
socket.on('productos', (prods) => {
    if (prods.length) {
        const html = `
        <h2 style="color:crimson;"> Lista de productos </h2>
            <div>
                <table class="table table-dark">
                    <tr>
                        <th> Title </th>
                        <th> Price </th>
                        <th> thumbnail </th>
                    </tr>
                    ${ prods.map(item => {
                        return `<tr>
                                    <td> ${item.title} </td>
                                    <td> ${item.price} </td>
                                    <td> <img src=${item.thumbnail} width="50" height="50" /></td>
                                </tr>`
                        }).join(" ")  
                    }
                </table>`
            return document.getElementById("productos").innerHTML = html
    } else {
        const html = `<h3 class="alert alert-danger"> No hay productos cargados</h3>`
        return document.getElementById("productos").innerHTML = html
    }
})

//mensaje para volver a renderizar el chat
socket.on('mensajes', (msjs) => {
    if (msjs.length) {
        const html = `
                    ${ msjs.map(item => {
                        return `<div class="form-inline" >
                                    <span class="text-primary font-weight-bold mr-3" > ${item.email} </span>
                                    <span class="text-warning mr-3" > ${item.fyh} </span>
                                    <span class="text-success font-italic" > ${item.mensaje} </span>
                                </div>`
                        }).join(" ")  
                    }
                </table>`
            return document.getElementById("chat").innerHTML = html
    } else {
        const html = `<h3 class="alert alert-danger"> No hay mensajes registrados</h3>`
        return document.getElementById("chat").innerHTML = html
    }
})

//funcion para ejecutar en el submit del formulario, la misma envia el nuevo objeto al servidor por websocket
const addProduct = () => { 
    //Agrego una validacion para que los campos estén completos, sino no avanza
    if (!document.getElementById("title").value){
        return false
    }
    if (!document.getElementById("price").value){
        return false
    }
    if (!document.getElementById("thumbnail").value){
        return false
    }

    const nuevoProd = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value
    }
    socket.emit('new-prod', nuevoProd)
}


//funcion para enviar mensaje de chat
const newMessage = () => { 
    //Agrego una validacion para que los campos estén completos, sino no avanza
    if (!document.getElementById("mail").value){
        return false
    }
    if (!document.getElementById("message").value){
        return false
    }
    let date = new Date()
    const nuevoMsj = {
        email: document.getElementById("mail").value,
        fyh: date,
        mensaje: document.getElementById("message").value
    }
    socket.emit('new-msg', nuevoMsj)
}