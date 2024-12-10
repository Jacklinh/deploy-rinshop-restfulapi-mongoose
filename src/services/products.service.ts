
import Category from "../models/categories.model";
import Product from "../models/products.model";
import { TypeProduct } from "../types/models";
import createError from "http-errors";

const findAll = async(query: any) => {
    // phan trang
    const page_str = query.page; // trang hien tai
    const limit_str = query.limit; // so luong item tren 1 trang
    const page = page_str ? parseInt(page_str) : 1;
    const limit = limit_str ? parseInt(limit_str) : 5;
    const offset = (page - 1) * limit;
    /* Sắp xếp */
    let objSort: any = {};
    const sortBy = query.sort || 'updateAt'; // Mặc định sắp xếp theo ngày tạo giảm dần
    const orderBy = query.order && query.order == 'ASC' ? 1: -1 ; // sắp xếp theo giá (mặc định theo giá giảm dần)
    objSort = {...objSort, [sortBy]: orderBy} // Thêm phần tử sắp xếp động vào object {}
    // filter theo tung dieu kien
    let objectFilter: any = {};
    // search theo ten san pham
    if(query.keyword && query.keyword !== '') {
        const regex = new RegExp(query.keyword, 'i');
        objectFilter = {
            ...objectFilter,
            $or: [
                { product_name: { $regex: regex } }
            ]
        };
    }
    // filter theo danh mục id
    if(query.category && query.category !== '') {
        objectFilter = {...objectFilter, category: query.category}
    }
    // filter theo khoảng giá
    if(query.price_min || query.price_max) {
        objectFilter.price = {};
        if(query.price_min) {
            objectFilter.price.$gte = parseInt(query.price_min);
        }
        if(query.price_max) {
            objectFilter.price.$lte = parseInt(query.price_max);
        }
    }
    

    const totalRecords = await Product.countDocuments(objectFilter);
    const products = await Product
    .find(objectFilter)
    .sort(objSort)
    .select('-__v')
    .populate({
        path: 'category',
        select: '-__v -createdAt -updatedAt',
    })
    .skip(offset)
    .limit(limit);
    
    return {
        products_list: products,
        sorts: objSort,
        filters: objectFilter,
        pagination: {
            page,
            limit,
            totalPage: Math.ceil(totalRecords / limit),
            totalRecords
        }
    }
}
const findByID = async(id: string) => {
    const product = await Product.findById(id).select('-__v');
    if(!product){
        throw createError(400, "product not found");
    }
    return product;
}
const createDocument = async(body: any) => {
    const payloads = {
        product_name : body.product_name,
        price: body.price,
        discount: body.discount,
        category: body.category,
        description: body.description,
        origin: body.model_year, 
        slug: body.slug,
        thumbnail: body.thumbnail, 
        gallery: body.gallery,
        stock: body.stock, 
        isBest: body.isBest, 
        isNewProduct: body.isNewProduct, 
        isShowHome: body.isShowHome, 
        isActive: body.isActive 
    }
    const product = await Product.create(payloads);
    return product;
}
const createRecord = async(payload: TypeProduct) => {
    const product = await Product.create(payload);
    return product;
}
const updateByID = async(id: string, payload: TypeProduct) => {
    const product = await findByID(id);
    Object.assign(product, payload);
    await product.save();
    return product;
}
const deleteByID = async(id: string) => {
    const product = await findByID(id);
    await product.deleteOne({_id: product._id});
    return product;
}
// client
const findAllClient = async(query: any) => {
    // phan trang
    const page_str = query.page; // trang hien tai
    const limit_str = query.limit; // so luong item tren 1 trang
    const page = page_str ? parseInt(page_str) : 1;
    const limit = limit_str ? parseInt(limit_str) : 9;
    const offset = (page - 1) * limit;
    /* Sắp xếp */
    let objSort: any = {};
    const sortBy = query.sort || 'updateAt'; // Mặc định sắp xếp theo ngày tạo giảm dần
    const orderBy = query.order && query.order == 'ASC' ? 1: -1 ; // sắp xếp theo giá (mặc định theo giá giảm dần)
    objSort = {...objSort, [sortBy]: orderBy} // Thêm phần tử sắp xếp động vào object {}
    // filter theo tung dieu kien
    let objectFilter: any = {};
    // search theo ten san pham
    if(query.keyword && query.keyword !== '') {
        const regex = new RegExp(query.keyword, 'i');
        objectFilter = {
            ...objectFilter,
            $or: [
                { product_name: { $regex: regex } }
            ]
        };
    }
    // filter theo khoảng giá
    if(query.price_min || query.price_max) {
        objectFilter.price = {};
        if(query.price_min) {
            objectFilter.price.$gte = parseInt(query.price_min);
        }
        if(query.price_max) {
            objectFilter.price.$lte = parseInt(query.price_max);
        }
    }
    
    // filter theo danh mục theo slug. nếu có slug thì tìm category trước
    if(query.category_slug && query.category_slug !== '') {
        const matchedCategory = await Category.findOne({ slug: query.category_slug });
        if(!matchedCategory) {
            // Nếu không tìm thấy category, trả về empty result
            return {
                products_list: [],
                sorts: objSort,
                filters: {
                    category_slug: query.category_slug
                },
                pagination: {
                    page,
                    limit,
                    totalPage: 0,
                    totalRecords: 0
                }
            };
        }
        objectFilter.category = matchedCategory._id;
    }
    const totalRecords = await Product.countDocuments(objectFilter);
    const products = await Product
    .find(objectFilter)
    .sort(objSort)
    .select('-__v')
    .populate({
        path: 'category',
        select: 'category_name description slug banner',
    })
    .skip(offset)
    .limit(limit);
    return {
        products_list: products,
        sorts: objSort,
        filters: {
            ...objectFilter,
            category_slug: query.category_slug
        },
        pagination: {
            page,
            limit,
            totalPage: Math.ceil(totalRecords / limit),
            totalRecords
        }
    }
}
// product detail and related product
const findOneBySlug = async(slug: string,limit: number = 5) => {
    const product = await Product.findOne({
        slug: slug
    })
    .select('-__v')
    .populate({
        path: 'category',
        select: '-__v -createdAt -updatedAt',
    });
    if(!product){
        throw createError(400, "product not found");
    }
    const relatedProducts = await Product
    .find({
            category: product.category,
            slug: { $ne: slug } // Loại bỏ sản phẩm hiện tại
        }
    )
    .select('-__v')
    .limit(limit)
    .populate({
        path: 'category',
        select: '-__v -createdAt -updatedAt',
    })

    return {
        product_detail: product,
        related_products: relatedProducts,
        limit: limit
    }
}
export default {
    findAll,
    findByID,
    findOneBySlug,
    createRecord,
    createDocument,
    updateByID,
    deleteByID,
    findAllClient
}