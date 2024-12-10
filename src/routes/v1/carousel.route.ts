import express from "express";
import carouselController from "../../controllers/carousel.controller";
import { authorizationAccess,authenticateToken } from '../../middlewares/auth.middleware';
import { EnumRole } from '../../types/models';
const router = express.Router();
// router cho client
router.get('/client',carouselController.findAll)
// Định nghĩa các role được phép truy cập
const ROLES = {
    VIEW: [EnumRole.ADMIN, EnumRole.USER, EnumRole.VIEWER],
    MODIFY: [EnumRole.ADMIN, EnumRole.USER],
    ADMIN: [EnumRole.ADMIN]
};
// 1 get all mainvs
//GET localhost:8000/api/v1/mainvs
router.get('',carouselController.findAll)
//2. Get One Category
//GET localhost:8000/api/v1/mainvs/:id
router.get('/:id',authenticateToken,authorizationAccess(ROLES.VIEW),carouselController.findByID)
//3. Create a new category
//POST localhost:8000/api/v1/mainvs
// khi có up image
router.post('',authenticateToken,authorizationAccess(ROLES.MODIFY),carouselController.createDocument)
//4. Update a category
//PUT localhost:8000/api/v1/mainvs/:id
router.put('/:id',authenticateToken,authorizationAccess(ROLES.MODIFY),carouselController.updateByID)
//5. Delete a category
//DELETE localhost:8000/api/v1/mainvs/:id
router.delete('/:id',authenticateToken,authorizationAccess(ROLES.ADMIN),carouselController.deleteByID)
export default router;