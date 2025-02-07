import express, {Express, Request, Response, NextFunction} from 'express';
import multer from 'multer';
import { uploadImage, uploadImages } from "../../helpers/multerUpload";
import { sendJsonSuccess } from "../../helpers/responseHandler";
import cors from 'cors'
import path from "path";
const router = express.Router();
// upload image
const app: Express = express();
// Danh sách các nguồn cho phép
const allowedOrigins = [
    'https://deploy-rinshop-admin.vercel.app',
    'https://deploy-rinshop-client-nextjs.vercel.app'
];
// Cấu hình middleware CORS
app.use(cors({
    origin: (origin, callback) => {
        // Nếu không có origin (ví dụ: khi gọi từ Postman), cho phép
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các phương thức cho phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header cho phép
}));
/* Bắt được dữ liệu từ body của request */
app.use(express.json())
//Mã hóa url
app.use(express.urlencoded({ extended: true }));
// Khai báo thư mục chứa tài nguyên tĩnh */
app.use(express.static(path.join(__dirname, '../public')))  
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
