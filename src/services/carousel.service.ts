import createError from "http-errors";
import Carousel from "../models/carousel.model";
import { TypeCarousel } from "../types/models";
const findAll= async(query: any)=>{
    // phan trang
    const page_str = query.page;
    const limit_str = query.limit;
    const page = page_str ? parseInt(page_str) : 1;
    const limit = limit_str ? parseInt(limit_str) : 5
    const offset = (page - 1) * limit;
    // find select * FROM categories
    const carousel = await Carousel
    .find()
    .select('-__v')
    .skip(offset)
    .limit(limit);
    const totalRecords = await Carousel.countDocuments();
    return {
        carousel_list: carousel,
        pagination: {
            page,
            limit,
            totalPage: Math.ceil(totalRecords / limit), // tong so trang
            totalRecords
        }
    }
}
const findByID = async(id: string) => {
    const carousel = await Carousel.findById(id).select('-__v');
    if(!carousel){
        throw createError(400,"Carousel not found");
    }
    return carousel;
}
// khi có up image
const createDocument = async(body: any) => {
    const payloads = {
        images : body.images,
    }
    const carousel = await Carousel.create(payloads);
    return carousel;
}
const updateByID = async(id: string, payload: TypeCarousel) => {
    const carousel = await findByID(id);
    Object.assign(carousel, payload); // Cập nhật các trường trong carousel
    await carousel.save(); // Lưu thay đổi vào cơ sở dữ liệu
    return carousel;
};
const deleteByID = async(id: string) => {
    const carousel = await findByID(id);
    await carousel.deleteOne({_id: carousel._id});
    return carousel;
}
export default {
    findAll,
    findByID,
    createDocument,
    updateByID,
    deleteByID
}