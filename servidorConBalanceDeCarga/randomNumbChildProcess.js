
const getRandomNumbs = (cant) => { 
    let numbArray = []
    for (let i = 0; i < cant; i++) {
        numbArray.push( Math.ceil(Math.random()*1000) ) 
    }
    return numbArray
}

process.on('exit', () => {} )

//mensaje desde el script de server que ejecuta la funcion
process.on('message', (msg) => {
    const result = getRandomNumbs(msg.cant)

    process.send(result)
    process.exit()
})

//mensaje inicial que dispara la funcion al forkearse el processo de este script
process.send('listo')