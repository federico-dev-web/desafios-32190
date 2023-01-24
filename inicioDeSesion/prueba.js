import bcrypt from "bcrypt"
import mongoUsuariosYContrasenias from "./containers/mongoContainerUsuariosYContrasenias.js"

const usuariosYContrasenias = new mongoUsuariosYContrasenias()

const user = "fede"
const plaintextPassword = "fede1"
const plaintextPassword2 = "quesosuizo"
const plaintextPassword3 = "quesofrances"

let hash1 = ""
console.log(1);
console.log(plaintextPassword);
/*
const first = async () => { 

    await bcrypt.hash(plaintextPassword, 10, function(err, hash) {
        console.log(2);
        console.log(hash);
        hash1 = hash
        bcrypt.compare(plaintextPassword3, hash1, function(err, result) {
                if (result) {
                   // password is valid
               }
            console.log(3);
            console.log(result);
            });
    

    
        bcrypt.compare(plaintextPassword, hash1, function(err, result) {
        console.log(hash1);
            if (result) {
               // password is valid
    
           }
        console.log(2);
        console.log(result);
        });
    })

}
*/

const enc = async (plaintextPassword) => { 

    console.log("1.0");
    let hashedPassword = ''
    await new Promise((resolve, reject) => {
        bcrypt.hash(plaintextPassword, 10, function(err, hash) {
            console.log(2);
            console.log(hash);
            hashedPassword = hash
            resolve(hash)
        });
    })
    console.log(hashedPassword);
    console.log("1.1");

    let obj = {
        user: user,
        passwordEnc: hashedPassword
    }
    console.log(3);
    console.log(obj);
    
    usuariosYContrasenias.insertarUsuario(obj)
    
    let coso = await usuariosYContrasenias.listarTodosLosUsuarios()
    
    console.log(4);
    console.log(coso);
}

//enc(plaintextPassword)



    bcrypt.compare("fede11", '$2b$10$Xwix6.8Nciizbbduf4liE.jC6.sXNWQ9LUn7vlZXIu7D0ZJ8TuZ.W', function(err, result) {
            if (result) {
               // password is valid
           }
        console.log(3);
        console.log(result);
        });