import express, {Express, Request, Response, NextFunction} from 'express';
import createError from 'http-errors';
import path from 'path';
import { sendJsonErrors } from './helpers/responseHandler';
/* import các routes */
import staffsRoute  from './routes/v1/staffs.route'
import authRoute from './routes/v1/auth.route'
import categoriesRoute from './routes/v1/categories.route';
import productsRoute from './routes/v1/products.route';
import uploadRouter from './routes/v1/upload.route';
import customersRoute from './routes/v1/customers.route';
import ordersRoute from './routes/v1/orders.route';
import dashboardRoute from './routes/v1/dashboard.route';
import carouselRoute from './routes/v1/carousel.route';
import resumeRoute from './routes/v1/resume.route';
import cors from 'cors'
// upload image
const app: Express = express();
// Danh sách các nguồn cho phép
const allowedOrigins = [
    'https://deploy-rinshop-admin.vercel.app',
    'https://deploy-rinshop-client-nextjs.vercel.app',
    'https://deploy-rinshop-restfulapi-mongoose.vercel.app/api/v1/upload/photo',
    'https://deploy-rinshop-restfulapi-mongoose.vercel.app'
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

// BẮT ĐẦU KHAI BÁO ROUTES ở trên app.use handle error
app.use('/api/v1/staffs', staffsRoute)
app.use('/api/v1/categories',categoriesRoute)
app.use('/api/v1/products',productsRoute)
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/upload', uploadRouter)
app.use('/api/v1/customers', customersRoute)
app.use('/api/v1/orders', ordersRoute)
app.use('/api/v1/dashboard', dashboardRoute)
app.use('/api/v1/carousel', carouselRoute)
app.use('/api/v1/resumes', resumeRoute)
// errors 404, not found
app.use((rep: Request, res: Response, next: NextFunction) => {
    next(createError(404))
})
app.use((rep: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*"); // Cho phép tất cả các nguồn
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})
// Báo lỗi ở dạng JSON
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    sendJsonErrors(res,err)
});

export default app