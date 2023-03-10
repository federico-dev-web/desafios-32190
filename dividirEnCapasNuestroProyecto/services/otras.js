export const getRandomNumbs = (cant) => { 
    let numbArray = []
    for (let i = 0; i < cant; i++) {
        numbArray.push( Math.ceil(Math.random()*1000) ) 
    }
    return numbArray
}