//defino variable que almacena nombre de session para el render y las funciones
let user = ''

//funcion que obtiene la session del back y realiza la renderizacion
const getSession = async () => { 
    user = await fetch('http://localhost:8080/login/get-session').then(
    (response) => response.json()
    ).then( 
        (data) => data.nombre
    ) 
    userValidate(user)
}

//funcion que crea la session
const setSession = async () => { 
    let userSend  = `{"nombre":"${document.getElementById("NombreLogIn").value}"}`
    await fetch('http://localhost:8080/login/set-session', 
        {   
            headers: {
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: userSend
        }
    )
}
//funcion que estira la duracion de la session
const resetSession = async () => { 
    let userSend = `{"nombre":"${user}"}`
    let res = ''
    await fetch('http://localhost:8080/login/reset-session', 
        {   
            headers: {
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: userSend
        }
    ).then(
        (response) => response.json()
        ).then( 
            (data) => { res = data.nombre }
        )
    return res
}

//ejecuto el render inicial
getSession()


//Valida si el usuario existe y renderiza en consecuencia el formulario de log in o la api test con el nombre del usuario de la sesion
const userValidate = (user) => { 
    if (!user) {
        const html = `
            <div class='conteiner'>
                <div class='jumbotron'>
                    <h1 style="color:blue;" > Login de Usuario</h1>
                    <label><b> Ingrese su Nombre </b></label>
                    <input class="form-control" type="text" id="NombreLogIn"></input>
                    <button class="btn btn-success mt-5 mb-5" onclick ="return logIn()" > Enviar </button>
                </div>
            </div>
            `
        return [
            document.getElementById("usuario").innerHTML = html ,
            document.getElementById("contenidoDeLogeo").style.display = 'none'
        ]
    }
    const html = `<div class="alert alert-success d-flex justify-content-between"  ><span class='display-4 font-weight-normal'> Bienvenido ${user} </span> <button class="btn btn-warning" onclick ="return logOut()"> Desloguear </button> </div>`
    return [
        document.getElementById("usuario").innerHTML = html ,
        document.getElementById("contenidoDeLogeo").style.display = 'block' 
    ] 
}


//Funcion de deslogeo de session y render de despedida, pasados 2 segundos vuelve a ejecutar la funcion de render incinial
const logOut = async () => {
    await fetch('http://localhost:8080/login/destroy')
    const html = `<div class="alert alert-primary d-flex justify-content-between"  ><span class='display-4 font-weight-normal'> Hasta luego ${user} </span></div>`
    user = ''
    document.getElementById("usuario").innerHTML = html ,
    document.getElementById("contenidoDeLogeo").style.display = 'none'
    setTimeout(() => {getSession()}, 2000)
}

//Boton de login que dispara funcion userValidate() para hacer el render
const logIn = async () => { 
    if (document.getElementById("NombreLogIn").value) {
        await setSession()
        await getSession()
    }
}


////////////////////////////////////////////

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

    //Desnormalizacion de mensaje
    const mensajes = {
        result: msjs[0].result,
        entities: msjs[0].entities
    }

    const mensajesDenormalizado = normalizr.denormalize(mensajes.result, chat, mensajes.entities)

    const mensajeRender = mensajesDenormalizado.mensajes

    //largo de mensajes y % de compresion
    const largoNorm = JSON.stringify(mensajes).length
    const largoDesnorm = JSON.stringify(mensajesDenormalizado).length
    const porcComp = largoNorm/largoDesnorm*100

    //renderizado de elementos
    if (mensajeRender.length) {
        const html = `
                    ${ mensajeRender.map(item => {
                        return `<div class="form-inline" >
                                    <span class="text-primary font-weight-bold mr-3" > ${item.author.email} </span>
                                    <span class="text-warning mr-3" > ${item.text.fyh} </span>
                                    <span class="text-success font-italic" > ${item.text.text} </span>
                                    <span class="text-success font-italic" > <img src=${item.author.avatar} width="30" height="30" />  </span>
                                </div>`
                        }).join(" ")  
                    }
                </table>`
            return [
                document.getElementById("chat").innerHTML = html ,
                document.getElementById("compresion").innerHTML = `Compresión: ${Math.round(porcComp * 100) / 100}%`
            ]
    } else {
        const html = `<h3 class="alert alert-danger"> No hay mensajes registrados</h3>`
        return document.getElementById("chat").innerHTML = html
    }
})


//funcion para ejecutar en el submit del formulario, la misma envia el nuevo objeto al servidor por websocket
const addProduct = async () => { 
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

    let estadoSession = await resetSession()
    console.log(estadoSession);
    if (estadoSession == 'session expirada') {
        await getSession()
    } else {
        socket.emit('new-prod', nuevoProd)
    }
}


//funcion para enviar mensaje de chat
const newMessage = async () => { 
    //Agrego una validacion para que los campos estén completos, sino no avanza
    if (!document.getElementById("mail").value){
        return false
    }
    if (!document.getElementById("message").value){
        return false
    }
    let date = new Date()
    const nuevoMsj = {
        author: {
            email: document.getElementById("mail").value,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            edad: Number(document.getElementById("edad").value),
            alias: document.getElementById("alias").value,
            avatar: document.getElementById("avatar").value
        },
        text: {
            text: document.getElementById("message").value,
            fyh: date
        }
    }
    let estadoSession = await resetSession()
    if (estadoSession == 'session expirada') {
        await getSession()
    } else {
        socket.emit('new-msg', nuevoMsj)
    }
}


const author = new normalizr.schema.Entity('author', {}, {idAttribute: 'email'});

const chat = new normalizr.schema.Entity('chat', { 
    mensajes: [ { author } ]
})

