
import createError from 'http-errors';
import Customer from '../models/customers.model';
import Order from '../models/orders.model';
import { TypeCustomer } from '../types/models';
const findAll = async (query: any) => {
    /* Phân trang */
    const page_str = query.page;
    const limit_str = query.limit;
    const page = page_str ? parseInt(page_str as string): 1;
    const limit = limit_str ? parseInt(limit_str as string): 3;
    const offset = (page - 1) * limit;
    
    /* end phan trang */
    /* Sắp xếp */
    let objSort: any = {};
    const sortBy = query.sort || 'updateAt'; // Mặc định sắp xếp theo ngày tạo giảm dần
    const orderBy = query.order && query.order == 'ASC' ? -1: 1;
    objSort = {...objSort, [sortBy]: orderBy} // Thêm phần tử sắp xếp động vào object {}
    /* search theo tên */
    let objectFilter: any = {};
    if(query.keyword && query.keyword !== '') {
        const regex = new RegExp(query.keyword, 'i');
        objectFilter = {
            ...objectFilter,
            $or: [
                { fullName: { $regex: regex } },
                { email: { $regex: regex } },
                { phone: { $regex: regex } }
            ]
        };
    }
    /* Select * FROM customers */
    const customers = await Customer
    .find(objectFilter)
    .sort(objSort)
    .select('-__v -password')
    .skip(offset)
    .limit(limit);
    //Đếm tổng số record hiện có của collection
    const totalRecords = await Customer.countDocuments(objectFilter);
    return {
        customers_list: customers,
        sorts: objSort,
        filters: objectFilter,
        // Phân trang
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalRecords / limit), //tổng số trang
            totalRecords
        }
    }
}
const findByID = async (id: string) => {
    const customer = await Customer.findById(id).select('-__v');
    if(!customer) {
        throw createError(400,'order not found')
    }
    return customer;
}
const createRecord = async (payload: TypeCustomer) => {
    const customer = await Customer.create(payload);
    return customer;
}
const updateByID = async (id: string, payload: TypeCustomer) => {
    //b1.Kiểm tra sự tồn tại của danh mục có id này
    const customer = await findByID(id);
    //2. Update = cách ghi đè thuộc tính
    Object.assign(customer,payload)
    await customer.save();
    //3. Trả về kết quả
    return customer;
}
const deleteByID = async (id: string) => {
    const customer = await findByID(id);
    // kiểm tra xem có đơn hàng nào liên quan đến customer không
    const existingOrders = await Order.find({customer: id});
    if(existingOrders && existingOrders.length > 0) {
        throw createError(400,'Không thể xóa khách hàng này vì đã có đơn hàng liên quan!')
    }
    // nếu không có đơn hàng liên quan thì xóa khách hàng
    await Customer.deleteOne({ _id: customer._id })
    return customer;
}
export default {
    findAll,
    findByID,
    createRecord,
    updateByID,
    deleteByID
}