import {Schema, model } from "mongoose";
import { buildSlug } from "../helpers/buildSlug";
import { TypeProduct, ProductUnit } from "../types/models";
import createError from "http-errors";
const productSchema = new Schema<TypeProduct>({
    product_name: {
        type: String,
        maxLength: 255,
        unique: true,
        trim: true
    },
    price: {
        type: Number,
        min: 0,
        default: 0,
    },
    // giá khuyến mãi
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    description: {
        type: String,
        require: false,
        trim: false
    },
    // xuất xứ
    origin: {
        type: String,
        require: false,
    },
    slug: {
        type: String,
        maxlength: 255,
        trim: true,
        require: false
    },
    // ảnh đại diện
    thumbnail: {
        type: String,
        maxlength: 255,
        require: false,
    },
    // các ảnh khác
    gallery: {
        type: String,
        required: false
    },
    // số lượng sản phẩm tồn kho
    stock: {
        type: Number,
        min: 0,
        default: 0,
        require: false,
    },
    // trạng thái sản phẩm
    isActive: {
        type: Boolean,
        drequire: false,
        default: false
    },
    /* SP bán chạy */
    isBest: {
        type: Boolean,
        require: false,
        default: false
    },
      /* SP mới về */
    isNewProduct: {
        type: Boolean,
        require: false,
        default: false
    },
      /* Show sp ra trang chủ */
    isShowHome: {
        type: Boolean,
        require: false,
        default: false
    },
    // đơn vị
    unit: {
        type: String,
        enum: Object.values(ProductUnit),
        require: false, 
        default: ProductUnit.KG
    },
},{
    timestamps: true
});

productSchema.pre('validate', async function(next){
    if(!this.product_name) {
        throw createError(400,"product name not found");
    }
    this.slug = buildSlug(this.product_name);
    const _price = this as any;
    if(_price.price) {
        _price.price = parseInt(_price.price, 10); // Chuyển thành số nguyên
    }
    next();
})
const Product = model<TypeProduct>('Product',productSchema);
export default Product;