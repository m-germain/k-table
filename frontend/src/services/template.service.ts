import { MProduct } from "../models";


const ProductService = {

    getProducts: async function (): Promise<string[]> {
        console.log('coucou');
        return ['yo'];
    },
    // products.doc(products.id).delete()
    // .then(() => {

    // })
    // .catch(error => {

    // })
}

export default ProductService;