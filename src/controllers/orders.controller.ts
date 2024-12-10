import {Request, Response, NextFunction} from 'express'
import ordersService from '../services/orders.service';
import { sendJsonSuccess } from '../helpers/responseHandler';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await ordersService.findAll(req.query);
        sendJsonSuccess(res,"success")(order);
    }catch(error) {
        next(error)
    }
}
const findByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id} = req.params;
      const order = await ordersService.findByID(id)
      sendJsonSuccess(res,"success")(order);
    }catch(error) {
      next(error)
    }
}
const createRecord = async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const order = await ordersService.createRecord(req.body, res.locals.customer)
        sendJsonSuccess(res,"success")(order);
    }catch(error) {
        next(error)
    }
    
}
const updateByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id} = req.params;
      const payload = req.body;
      const newOrder = await ordersService.updateByID(id,payload);
      sendJsonSuccess(res,"success")(newOrder);
    }catch(error) {
      next(error)
    }
}
const deleteByID =async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id} = req.params;
      const order =await ordersService.deleteByID(id)
      sendJsonSuccess(res,"success")(order);
    }catch(error) {
      next(error)
    }
}
export default {
    findAll,
    findByID,
    createRecord,
    updateByID,
    deleteByID
}