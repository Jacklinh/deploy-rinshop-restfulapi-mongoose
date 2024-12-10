
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {globalConfig} from '../constants/configs';
import { buildSlugImage } from "./buildSlug";

const storageImage = multer.diskStorage({ // dùng diskStorage để xác định địa chỉ lưu trữ 
    //nơi thư mục sẽ được lưu
    destination: function (req, file, cb) {
        // nếu thư mục lưu nếu chưa tồn tạo sẽ tạo folder mới
        const PATH = `${globalConfig.UPLOAD_DIRECTORY}`;
        if(!fs.existsSync(PATH)){
            // tạo folder
            fs.mkdirSync(PATH, {recursive: true})
        }
        cb(null, PATH)
    },
    // rename image đúng dạng slug 
    filename: function (req, file, cb) {
        const fileInfo = path.parse(file.originalname);
        const newFileName = buildSlugImage(fileInfo.name);
        const newFileInfo = newFileName +'-'+ Date.now() + fileInfo.ext;
        cb(null,newFileInfo)
    }
    
})
const imageFilter = function(req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    // Mot mang cac dinh dang tap tin cho phep duoc tai len
    const mimetypeAllow = ["image/png", "image/jpg", "image/gif", "image/jpeg", "image/webp"];
    if (!mimetypeAllow.includes(file.mimetype)) {
        //req.fileValidationError = 'Only .png, .gif, .jpg, webp, and .jpeg format allowed!';
        return cb(new Error('Only .png, .gif, .jpg, webp, and .jpeg format allowed!'));
    }
    cb(null, true);
};
  
const uploadImage = multer({ 
    storage: storageImage,
    fileFilter: imageFilter
}).single('file')
const uploadImages = multer({ 
    storage: storageImage,
    fileFilter: imageFilter
}).array('images', 10)   
export {
    uploadImage,
    uploadImages,
}


