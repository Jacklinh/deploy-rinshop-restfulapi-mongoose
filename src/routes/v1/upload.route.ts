import express from "express";
import multer from 'multer';
import { uploadImage, uploadImages } from "../../helpers/multerUpload";
import { sendJsonSuccess } from "../../helpers/responseHandler";
const router = express.Router();

// upload 1 ảnh
router.post('/photo', (req, res, next) => {
    uploadImage(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).json({
                statusCode: 500,
                message: err.message,
                typeError: 'MulterError'
            })
        } else if (err) {
            res.status(500).json({
                statusCode: 500,
                message: err.message,
                typeError: 'UnKnownError'
            })
        }
        return sendJsonSuccess(res)({
            link: `uploads/${req.file?.filename}`,
            payload: req.body
        });
    })
})
// Upload nhiều ảnh
router.post('/photos', (req, res, next) => {
    uploadImages(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({
                statusCode: 500,
                message: err.message,
                typeError: 'MulterError'
            });
        }
        if (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err.message,
                typeError: 'UnKnownError'
            });
        }

        // Kiểm tra và ép kiểu req.files
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: 'No files uploaded',
                typeError: 'ValidationError'
            });
        }

        return sendJsonSuccess(res)({
            data: {
                files: files.map((file) => ({
                    filename: file.filename,
                    originalname: file.originalname,
                    path: `uploads/${file.filename}`,
                    size: file.size,
                    mimetype: file.mimetype
                })),
                links: files.map((file) => `uploads/${file.filename}`),
                payload: req.body
            }
        });
    });
});
export default router;
