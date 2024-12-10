import {Request, Response, NextFunction} from 'express';
import { sendJsonSuccess } from '../helpers/responseHandler';
import dashboardService from '../services/dashboard.service';

const getStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const statistics = await dashboardService.getStatistics();
        sendJsonSuccess(res, "success")(statistics);
    }catch(error) {
        next(error);
    }
}

const getRecentOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recentOrders = await dashboardService.getRecentOrders(req.query);
        sendJsonSuccess(res, "success")(recentOrders);
    }catch(error) {
        next(error);
    }
}
const getInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const inventory = await dashboardService.getInventory();
        sendJsonSuccess(res, "success")(inventory);
    }catch(error) {
        next(error);
    }
}
export default {
    getStatistics,
    getRecentOrders,
    getInventory
}