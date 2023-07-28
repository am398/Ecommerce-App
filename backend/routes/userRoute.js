import express from 'express';
import { forgotPassword, logoutUser, registerUser, resetPassword
    ,getUserDetails, updatePassword, updateProfile ,getAllUser, getSingleUser,updateUserRole, deleteUser} from '../controllers/userController.js';
import { loginUser } from '../controllers/userController.js';
import { isAuthenticatedUser,authorizeRoles} from '../middleware/auth.js';

const router = express.Router();
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route('/me').get(isAuthenticatedUser,getUserDetails);
router.route('/password/update').put(isAuthenticatedUser,updatePassword);
router.route('/me/update').put(isAuthenticatedUser,updateProfile);
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles("Admin"),getAllUser);
router.route('/admin/users/:id')
.get(isAuthenticatedUser,authorizeRoles("Admin"),getSingleUser)
.put(isAuthenticatedUser,authorizeRoles("Admin"),updateUserRole)
.delete(isAuthenticatedUser,authorizeRoles("Admin"),deleteUser);

export default router;

