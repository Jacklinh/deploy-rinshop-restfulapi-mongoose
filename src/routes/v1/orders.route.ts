import express from 'express'
import ordersController from '../../controllers/orders.controller';
import { authorizationAccess,authenticateToken } from '../../middlewares/auth.middleware';
import { EnumRole } from '../../types/models';
const router = express.Router();
// route public
router.post('/checkout',ordersController.createRecord)
// Định nghĩa các role được phép truy cập
const ROLES = {
    VIEW: [EnumRole.ADMIN, EnumRole.USER, EnumRole.VIEWER],
    MODIFY: [EnumRole.ADMIN, EnumRole.USER],
    ADMIN: [EnumRole.ADMIN]
};
//1. Get All orders
//GET localhost:8000/api/v1/orders
router.get('', ordersController.findAll);
//2. Get One staff
//GET localhost:8000/api/v1/orders/:id
router.get('/:id',ordersController.findByID)
//3. Create a new staff
//POST localhost:8000/api/v1/orders
router.post('',ordersController.createRecord)
//4. Update a staff
//PUT localhost:8000/api/v1/orders/:id
router.put('/:id',authenticateToken,authorizationAccess(ROLES.MODIFY),ordersController.updateByID)
//5. Delete a staff
//DELETE localhost:8000/api/v1/orders/:id
router.delete('/:id',authenticateToken,authorizationAccess(ROLES.ADMIN),ordersController.deleteByID)
export default router;