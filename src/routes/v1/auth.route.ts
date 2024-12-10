import express from 'express';
import validateSchemaYup from '../../middlewares/validateSchemaYup.middleware';
import authYupValidation from '../../validations/authYup.validation';
import authController from '../../controllers/auth.controller';
import { authenticateToken, authenticateTokenClient } from '../../middlewares/auth.middleware';

const router = express.Router()

//POST v1/auth/login
router.post('/login', validateSchemaYup(authYupValidation.loginSchema), authController.login)

router.get('/profile', authenticateToken, authController.profile)
// dung cho client 
router.post('/client/login', validateSchemaYup(authYupValidation.loginSchema), authController.loginClient)

router.get('/client/profile', authenticateTokenClient, authController.profileClient)
export default router
