import express from 'express';
import {
    newOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder
} from "../controllers/orderController.js";
const router = express.Router();

import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

router.route('/order/new').post(isAuthenticatedUser,newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router
    .route("/admin/orders")
    .get(isAuthenticatedUser, authorizeRoles("Admin"), getAllOrders);

router
    .route("/admin/order/:id")
    .put(isAuthenticatedUser, authorizeRoles("Admin"), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteOrder);

export default router;