import {Request, Response, NextFunction} from 'express';
import carouselService from '../services/carousel.service';
import { sendJsonSuccess } from '../helpers/responseHandler';
import {  uploadImages } from '../helpers/multerUpload';
import multer from 'multer';
const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const carousel = await carouselService.findAll(req.query);
        sendJsonSuccess(res,"success")(carousel); 
    }catch(error) {
        next(error)
    }
}
const findByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const carousel = await carouselService.findByID(id);
        sendJsonSuccess(res,"success")(carousel);
    }catch(error) {
        next(error)
    }
}
const createDocument = async (req: Request, res: Response, next: NextFunction)=>{
    try {
        uploadImages(req, res, async function (error) {
            if (error) {
                return res.status(500).json({ message: error.message });
            }
            if (!Array.isArray(req.files) || req.files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }
            const carousel = await carouselService.createDocument({
                images: req.files.map(file => `uploads/${file.filename}`) // Lưu tất cả hình ảnh vào mảng
            });
            sendJsonSuccess(res)(carousel);
        });
    } catch (error) {
      next(error)
    }
}
const updateByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const payload = req.body;
        const newCarousel = await carouselService.updateByID(id,payload);
        sendJsonSuccess(res,"success")(newCarousel);
    }catch(error) {
        next(error)
    }
}
const deleteByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const carousel = await carouselService.deleteByID(id);
        sendJsonSuccess(res,"succcess")(carousel);
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