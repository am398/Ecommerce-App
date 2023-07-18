import express from "express"

const router = express.Router();

import { createproduct, deleteProduct, getallproducts, updateProduct,getSingleProduct} from '../controllers/productcontroller.js';
router.route('/products').get(getallproducts);
router.route('/products/new').post(createproduct);
router.route('/products/:id').put(updateProduct).delete(deleteProduct).get(getSingleProduct);

export default router;