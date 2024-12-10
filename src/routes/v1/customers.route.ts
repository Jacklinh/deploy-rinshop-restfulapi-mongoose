import express from 'express'
import customersController from '../../controllers/customers.controller';
import customerValidation from '../../validations/customer.validation';
import validateSchema from '../../middlewares/validateSchema.middleware';
import { authorizationAccess,authenticateToken } from '../../middlewares/auth.middleware';
import { EnumRole } from '../../types/models';
const router = express.Router();
// public route
router.post('/register', customersController.createRecord)
// Định nghĩa các role được phép truy cập
const ROLES = {
    VIEW: [EnumRole.ADMIN, EnumRole.USER, EnumRole.VIEWER],
    MODIFY: [EnumRole.ADMIN, EnumRole.USER],
    ADMIN: [EnumRole.ADMIN]
};
//1. Get All customers
//GET localhost:8000/api/v1/customers
router.get('', customersController.findAll);
//2. Get One customers
//GET localhost:8000/api/v1/customers/:id
router.get('/:id',customersController.findByID)
//3. Create a new customers
//POST localhost:8000/api/v1/customers
router.post('', authenticateToken,authorizationAccess(ROLES.MODIFY),validateSchema(customerValidation.createSchema), customersController.createRecord)
//4. Update a customers
//PUT localhost:8000/api/v1/customers/:id
router.put('/:id',authenticateToken,authorizationAccess(ROLES.MODIFY),customersController.updateByID)
//5. Delete a customers
//DELETE localhost:8000/api/v1/customers/:id
router.delete('/:id',authenticateToken,authorizationAccess(ROLES.ADMIN),customersController.deleteByID)
export default router;