import { faker } from '@faker-js/faker'

faker.locale = 'es'

const getFakeProd = () => { 
    let objs = {
        title: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnail: faker.image.image()
    }
    return objs
}

export default getFakeProd


