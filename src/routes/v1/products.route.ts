import express from "express";
import productsController from "../../controllers/products.controller";
import { authorizationAccess,authenticateToken } from '../../middlewares/auth.middleware';
import { EnumRole } from '../../types/models';
const router = express.Router();
// router public client
// get all products & product category
router.get('/client',productsController.findAllClient)
// product detail and related product
router.get('/client/detail/:slug',productsController.findOneBySlug)
// Định nghĩa các role được phép truy cập
const ROLES = {
    VIEW: [EnumRole.ADMIN, EnumRole.USER, EnumRole.VIEWER],
    MODIFY: [EnumRole.ADMIN, EnumRole.USER],
    ADMIN: [EnumRole.ADMIN]
};
// check token để các route là private
// router.use(authenticateToken)
// 1 get all products
//GET localhost:8000/api/v1/products
router.get('',authenticateToken,authorizationAccess(ROLES.VIEW),productsController.findAll)
//2. Get One products
//GET localhost:8000/api/v1/products/:id
router.get('/:id',authenticateToken,authorizationAccess(ROLES.VIEW),productsController.findByID)
//3. Create a new products
//POST localhost:8000/api/v1/products
//router.post('',productsController.createRecord)
router.post('',authenticateToken,authorizationAccess(ROLES.MODIFY),productsController.createDocument)
//4. Update a products
//PUT localhost:8000/api/v1/products/:id
router.put('/:id',authenticateToken,authorizationAccess(ROLES.MODIFY),productsController.updateByID)
//5. Delete a products
//DELETE localhost:8000/api/v1/products/:id
router.delete('/:id',authenticateToken,authorizationAccess(ROLES.ADMIN),productsController.deleteByID)
export default router;