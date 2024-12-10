import express from 'express'
import staffsController from '../../controllers/staffs.controller';
import { authorizationAccess,authenticateToken } from '../../middlewares/auth.middleware';
import { EnumRole } from '../../types/models';
const router = express.Router();
// Định nghĩa các role được phép truy cập
const ROLES = {
    VIEW: [EnumRole.ADMIN, EnumRole.USER, EnumRole.VIEWER],
    MODIFY: [EnumRole.ADMIN, EnumRole.USER],
    ADMIN: [EnumRole.ADMIN]
};
//1. Get All Staffs
//GET localhost:8000/api/v1/staffs
router.get('', authenticateToken,authorizationAccess(ROLES.VIEW), staffsController.findAll);
//2. Get One staff
//GET localhost:8000/api/v1/staffs/:id
router.get('/:id',authenticateToken,authorizationAccess(ROLES.VIEW), staffsController.findByID)
//3. Create a new staff
//POST localhost:8000/api/v1/staffs
router.post('',authenticateToken,authorizationAccess(ROLES.MODIFY), staffsController.createRecord)
//4. Update a staff
//PUT localhost:8000/api/v1/staffs/:id
router.put('/:id',authenticateToken,authorizationAccess(ROLES.MODIFY), staffsController.updateByID)
//5. Delete a staff
//DELETE localhost:8000/api/v1/staffs/:id
router.delete('/:id',authenticateToken,authorizationAccess(ROLES.ADMIN), staffsController.deleteByID)
export default router;