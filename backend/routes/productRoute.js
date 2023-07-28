import express from "express";
import { createproduct, deleteProduct, getallproducts,
   updateProduct,getProductDetails,createProductReview, deleteReview, getProductReviews} from '../controllers/productcontroller.js';
import  {authorizeRoles, isAuthenticatedUser}  from "../middleware/auth.js";

const router = express.Router();
router.route('/products').get(isAuthenticatedUser,authorizeRoles("Admin"),getallproducts);
router.route('/products/new').post(isAuthenticatedUser,createproduct);
router.route('/products/:id').put(updateProduct).delete(deleteProduct).get(getProductDetails);


// router
//   .route("/admin/products")
//   .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createproduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser,deleteReview)


export default router;