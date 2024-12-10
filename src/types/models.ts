import { ObjectId } from "mongoose";

export type TypeStaff = {
    _id?: ObjectId;
    fullName: string;
    phone: string;
    email: string;
    address: string,
    password: string;
    active?: boolean,
    role:  EnumRole;
}

export type TypeCategory = {
    _id?: ObjectId,
    category_name: string,
    description?: string,
    slug?: string,
    banner?: string
}

export type TypeProduct = {
    _id?: ObjectId,
    product_name: string,
    price: number,
    discount: number,// Giảm giá cho sản phẩm (nếu có), có thể là tỷ lệ phần trăm hoặc số tiền.
    category: ObjectId,
    description?: string,
    origin?: string, // nơi xuất xứ sản phẩm
    slug?: string,
    thumbnail?: string, // image sản phẩm
    gallery?: string, // images 
    stock?: number, //Số lượng sản phẩm có trong kho
    isActive: boolean, // trạng thái hoạt động của sản phẩm
    isBest: boolean, /* SP bán nổi bật */
    isNewProduct: boolean, /* SP mới về */
    isShowHome: boolean, // sản phẩm có hiển thị trên trang chủ không.
    unit?: ProductUnit, // đơn vị
}
export type TypeOderItems = {
    product: ObjectId,
    product_name?: string,
    quantity: number,
    price: number,
    discount: number
}
export type TypeOrder = {
    _id?: ObjectId,
    order_code?: string,// mã đơn hàng
    customer?: string | ObjectId | {
        fullName: string,
        email: string,
        phone: string,
        password: string,
        address: string
    },
    payment_type?: number,// loại thanh toán
    payment_status?: number,// trạng thái thanh toán
    status?: number,// trạng thái đơn hàng
    shipping_address?: string,// địa chỉ giao hàng
    tracking_number?: string,// số điện thoại giao hàng
    shipping_fee: number,// phí vận chuyển
    note?: string,// ghi chú
    order_items: TypeOderItems[],
    total_amount?: number,
    cancelled_reason?: string,// lý do hủy đơn
    cancelled_at?: Date,// thời gian hủy đơn
    delivered_at?: Date,// thời gian giao hàng
    createdAt?: Date;
    updatedAt?: Date;
}
export type TypeCustomer = {
    _id?: ObjectId,
    fullName: string,
    password: string,
    phone: string;
    email?: string;
    address: string,
    active?: boolean,
}
export enum EnumRole {
    ADMIN = 'admin', // all quyền
    USER = 'user', // người dùng có quyền thêm, sửa nhưng không có xoá
    VIEWER = 'viewer'// người dùng chỉ có quyền xem sản phẩm.
}
// đơn vị sản phẩm
export enum ProductUnit {
    KG = 'kg',
    GRAM = 'gram',
    BUNCH = 'bó',
    PACK = 'gói',
    OTHER = 'khác'
}

export type TypeCarousel = {
    _id?: ObjectId,
    images?: string[],
    active?: boolean
}

