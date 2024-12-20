import express from "express";
import resumeController from "../../controllers/resume.controller";
import { authorizationAccess,authenticateToken } from '../../middlewares/auth.middleware';
import { EnumRole } from '../../types/models';
const router = express.Router();
// Định nghĩa các role được phép truy cập
const ROLES = {
    VIEW: [EnumRole.ADMIN, EnumRole.USER, EnumRole.VIEWER],
    MODIFY: [EnumRole.ADMIN, EnumRole.USER],
    ADMIN: [EnumRole.ADMIN]
};
// 1 get all resumes
//GET localhost:8000/api/v1/resumes
router.get('',resumeController.findAll)
//2. Get One resumes
//GET localhost:8000/api/v1/resumes/:id
router.get('/:id',authenticateToken,authorizationAccess(ROLES.VIEW),resumeController.findByID)
//3. Create a new category
//POST localhost:8000/api/v1/resumes
// khi có up image
router.post('',authenticateToken,authorizationAccess(ROLES.MODIFY),resumeController.createDocument)
//4. Update a resumes
//PUT localhost:8000/api/v1/resumes/:id
router.put('/:id',authenticateToken,authorizationAccess(ROLES.MODIFY),resumeController.updateByID)
//5. Delete a resumes
//DELETE localhost:8000/api/v1/resumes/:id
router.delete('/:id',authenticateToken,authorizationAccess(ROLES.ADMIN),resumeController.deleteByID)
export default router;