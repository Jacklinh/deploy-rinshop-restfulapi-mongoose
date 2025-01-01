import {Request, Response, NextFunction} from 'express';
import categoriesService from '../services/categories.service';
import { sendJsonSuccess } from '../helpers/responseHandler';
import { uploadImage } from '../helpers/multerUpload';
import multer from 'multer';
const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await categoriesService.findAll(req.query);
        sendJsonSuccess(res,"success")(category); 
    }catch(error) {
        next(error)
    }
}
const findByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const category = await categoriesService.findByID(id);
        sendJsonSuccess(res,"success")(category);
    }catch(error) {
        next(error)
    }
}
const createRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        const category = await categoriesService.createRecord(payload);
        sendJsonSuccess(res,"success")(category);
    }catch(error) {
        next(error)
    }
}
const createDocument = async (req: Request, res: Response, next: NextFunction)=>{
    try {
        uploadImage(req, res, async function (error) {
        if (error instanceof multer.MulterError) {
           // 1 lỗi của Multer xảy ra khi upload.
           res.status(500).json({
              statusCode: 500,
              message: error.message,
              typeError: 'MulterError'
          })
        } else if (error) {
          // 1 lỗi không xác định xảy ra khi upload.
          res.status(500).json({
              statusCode: 500,
              message: error.message,
              typeError: 'UnKnownError'
          })
        }
        else{
        const categoryData = {
            ...req.body,
            // Nếu có hình ảnh, cập nhật link sản phẩm, nếu không thì để null hoặc một giá trị mặc định
            banner: req.file ? `uploads/${req.file.filename}` : null, // Cập nhật lại link sản phẩm nếu có hình ảnh
        };

        const product = await categoriesService.createDocument(categoryData);
        sendJsonSuccess(res)(product)
        }
      })
    } catch (error) {
      next(error)
    }
}
const updateByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const payload = req.body;
        const newCategory = await categoriesService.updateByID(id,payload);
        sendJsonSuccess(res,"success")(newCategory);
    }catch(error) {
        next(error)
    }
}
const deleteByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const category = await categoriesService.deleteByID(id);
        sendJsonSuccess(res,"succcess")(category);
    }catch(error) {
        next(error)
    }
}
export default {
    findAll,
    findByID,
    createRecord,
    createDocument,
    updateByID,
    deleteByID
}