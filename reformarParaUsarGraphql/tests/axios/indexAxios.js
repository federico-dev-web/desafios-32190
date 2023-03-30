import axios from 'axios'

const url = 'http://localhost:8080/productos/'

let idModify = ''

await axios(`${url}`)
    .then( resp => { console.log(resp.data) } )
    .catch( err => { console.log(err) } )



await axios.post(`${url}`,    
    {
        title:"regla",
        price:12223.45,
        thumbnail:"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
    }
    ).then( resp => { console.log(resp.data)
        idModify = resp.data[0]._id
    } )
    .catch( err => { console.log(err) } )

await axios.put(`${url}${idModify}`, {
        title:"regla",
        price:12223.45,
        thumbnail:"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
        id: `${idModify}`
    }   
    ).then( resp => { console.log(resp.data) } )
    .catch( err => { console.log(err) } )

await axios(`${url}`)
    .then( resp => { console.log(resp.data) } )
    .catch( err => { console.log(err) } )

await axios.delete(`${url}${idModify}`
    ).then( resp => { console.log(resp.data) } )
    .catch( err => { console.log(err) } )

await axios(`${url}`)
    .then( resp => { console.log(resp.data) } )
    .catch( err => { console.log(err) } )
