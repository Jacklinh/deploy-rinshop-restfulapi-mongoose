import {Request, Response, NextFunction} from 'express'
import resumeService from '../services/resume.service';
import { sendJsonSuccess } from '../helpers/responseHandler';
import { uploadImage } from '../helpers/multerUpload';
import multer from 'multer';
const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const resume = await resumeService.findAll(req.query);
        sendJsonSuccess(res,"success")(resume);
    }catch(error) {
        next(error)
    }
}
const findByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id} = req.params;
      const resume = await resumeService.findByID(id)
      sendJsonSuccess(res,"success")(resume);
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
        
        const resume = await resumeService.createDocument({
            ...req.body,
            personalInfo: {
                avatar: `uploads/${req.file?.filename}`
            },
            projects: [
                {
                    image: `uploads/${req.file?.filename}`
                }
            ]
        })
        sendJsonSuccess(res)(resume)
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
      const resume = await resumeService.updateByID(id,payload);
      sendJsonSuccess(res,"success")(resume);
    }catch(error) {
      next(error)
    }
}
const deleteByID =async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id} = req.params;
      const resume =await resumeService.deleteByID(id)
      sendJsonSuccess(res,"success")(resume);
    }catch(error) {
      next(error)
    }
}
export default {
    findAll,
    findByID,
    createDocument,
    updateByID,
    deleteByID
}