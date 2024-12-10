import express from "express";
import categoriesController from "../../controllers/categories.controller";
import { authorizationAccess,authenticateToken } from '../../middlewares/auth.middleware';
import { EnumRole } from '../../types/models';
const router = express.Router();
// router cho client
router.get('/client',categoriesController.findAll)
// Định nghĩa các role được phép truy cập
const ROLES = {
    VIEW: [EnumRole.ADMIN, EnumRole.USER, EnumRole.VIEWER],
    MODIFY: [EnumRole.ADMIN, EnumRole.USER],
    ADMIN: [EnumRole.ADMIN]
};
// 1 get all categories
//GET localhost:8000/api/v1/categories
router.get('',authenticateToken,authorizationAccess(ROLES.VIEW),categoriesController.findAll)
//2. Get One Category
//GET localhost:8000/api/v1/categories/:id
router.get('/:id',authenticateToken,authorizationAccess(ROLES.VIEW),categoriesController.findByID)
//3. Create a new category
//POST localhost:8000/api/v1/categories
//router.post('',categoriesController.createRecord)
// khi có up image
router.post('',authenticateToken,authorizationAccess(ROLES.MODIFY),categoriesController.createDocument)
//4. Update a category
//PUT localhost:8000/api/v1/categories/:id
router.put('/:id',authenticateToken,authorizationAccess(ROLES.MODIFY),categoriesController.updateByID)
//5. Delete a category
//DELETE localhost:8000/api/v1/categories/:id
router.delete('/:id',authenticateToken,authorizationAccess(ROLES.ADMIN),categoriesController.deleteByID)
export default router;