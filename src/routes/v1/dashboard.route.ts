import express from 'express';
import dashboardController from '../../controllers/dashboard.controller';

const router = express.Router();

router.get('', dashboardController.getStatistics);
router.get('/recent-orders', dashboardController.getRecentOrders);
router.get('/inventory', dashboardController.getInventory);
export default router;