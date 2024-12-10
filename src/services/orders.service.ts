import createError from 'http-errors';
import Order from '../models/orders.model';
import { TypeOrder } from '../types/models';
import Customer from '../models/customers.model';
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
        const keyword = query.keyword;
        const customerMatch = await Customer.find({
            $or: [
                { fullName: { $regex: keyword, $options: 'i' } },
                { email: { $regex: keyword, $options: 'i' } },
                { phone: { $regex: keyword, $options: 'i' } }
            ]
        }).select('_id');

        const customerIds = customerMatch.map(customer => customer._id);

        objectFilter = {
            $or: [
                { order_code: { $regex: keyword, $options: 'i' } },
                { customer: { $in: customerIds } }
            ]
        };
    }
    // Filter theo trạng thái đơn hàng
    if(query.status) {
        objectFilter.status = Number(query.status);
    }
    // Filter theo trạng thái thanh toán
    if(query.payment_status) {
        objectFilter.payment_status = Number(query.payment_status);
    }

    // Filter theo loại thanh toán
    if(query.payment_type) {
        objectFilter.payment_type = Number(query.payment_type);
    }

    // Filter theo khoảng thời gian
    if(query.start_date && query.end_date) {
        objectFilter.createdAt = {
            $gte: new Date(query.start_date),
            $lte: new Date(query.end_date)
        }
    }
    // Filter theo customer ID
    if(query.customer) {
        objectFilter = {
            ...objectFilter,
            customer: query.customer
        }
    }

    // Filter theo product ID
    if(query.product) {
        objectFilter = {
            ...objectFilter,
            products: query.product
        }
    }
    /* Select * FROM orders */
    const orders = await Order
    .find(objectFilter)
    .sort(objSort)
    .select('-__v')
    .populate({
        path: 'customer',
        select: 'fullName email phone address',
    })
    .populate({
        path: 'order_items.product',  // Thêm populate cho product trong order_items
        select: 'product_name thumbnail', // Chỉ lấy các field cần thiết
    })
    .skip(offset)
    .limit(limit);
    // Lọc lại các đơn hàng có customer match với keyword
    const filteredOrders = orders.filter(order => order.customer !== null);
    // Transform data để thêm product_name vào order_items
    const transformedOrders = orders.map(order => {
        const orderObj = order.toObject();
        orderObj.order_items = orderObj.order_items.map((item: any) => ({
            ...item,
            product_name: item.product?.product_name || 'Sản phẩm không tồn tại'
        }));
        return orderObj;
    });
    /* Đếm tổng số record */
    const totalRecords = await Order.countDocuments(objectFilter);

    return {
        orders_list: transformedOrders,
        sorts: objSort,
        filters: objectFilter,
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalRecords / limit),
            totalRecords
        }
    }
}
const findByID = async (id: string) => {
    const order = await Order.findById(id).select('-__v');
    if(!order) {
        throw createError(400,'order not found')
    }
    return order;
}
/*
Logic tạo đơn hàng 
1. Nếu khách đã login thì check và lấy thông tin customer từ header, dựa vào token
2. Nếu chưa login thì check nếu tồn tại email, phone chưa. Nếu chưa thì tạo mới customer
3. Tạo đơn dựa trên thông tin customer
4. Mặc định để thông tin staff là null, vì chưa có ai duyệt đơn
*/

const createRecord = async (payload: TypeOrder, customerLogined: any) => {
    try {
        let customerId;
        // Thêm type guard để kiểm tra customer object
        interface CustomerObject {
            fullName: string;
            email: string;
            phone: string;
            password: string;
            address: string;
        }

        const isCustomerObject = (customer: any): customer is CustomerObject => {
            return customer 
                && typeof customer === 'object'
                && 'email' in customer
                && 'fullName' in customer
                && 'phone' in customer
                && 'password' in customer
                && 'address' in customer;
        };
        // Xử lý customer
        if (customerLogined) {
            // Nếu có customer đã đăng nhập, sử dụng ID của họ
            customerId = customerLogined._id;
        } else if (typeof payload.customer === 'string') {
            // Nếu customer là string (ID), sử dụng trực tiếp
            customerId = payload.customer;
        } else if (payload.customer && isCustomerObject(payload.customer)) {
            // Nếu là customer mới, kiểm tra email tồn tại
            const existingCustomer = await Customer.findOne({ 
                email: payload.customer.email
            });

            if (existingCustomer) {
                customerId = existingCustomer._id;
            } else {
                // Tạo customer mới nếu chưa tồn tại
                const newCustomer = await Customer.create(payload.customer);
                customerId = newCustomer._id;
            }
        }

        if (!customerId) {
            throw new Error('Customer information is required');
        }

        // Tạo đơn hàng
        const orderData = {
            customer: customerId,
            payment_type: payload.payment_type,
            shipping_address: payload.shipping_address,
            shipping_fee: payload.shipping_fee || 0,
            note: payload.note,
            order_items: payload.order_items,
            total_amount: payload.total_amount,
            status: 1,
            payment_status: 1,
        };

        const order = await Order.create(orderData);
        return order;
    } catch (error) {
        throw error;
    }
};
const updateByID = async (id: string, payload: TypeOrder) => {
    try {
        //b1.Kiểm tra sự tồn tại của đơn hàng
        const order = await findByID(id);
        
        // Nếu đơn hàng đã hoàn thành hoặc đã hủy, không cho phép cập nhật
        if (order.status === 4 || order.status === 5) {
            throw createError(400, 'Không thể cập nhật đơn hàng đã hoàn thành hoặc đã hủy');
        }

        // Cập nhật thời gian tương ứng với trạng thái
        if (payload.status === 4) { // Đã giao hàng
            payload.delivered_at = new Date();
        } else if (payload.status === 5) { // Đã hủy
            payload.cancelled_at = new Date();
        }

        // Tính lại tổng tiền từ order_items
        if (payload.order_items) {
            payload.total_amount = payload.order_items.reduce((sum, item) => {
                return sum + (item.price * item.quantity * (1 - item.discount/100));
            }, 0) + (payload.shipping_fee || order.shipping_fee || 0);
        }

        // Cập nhật đơn hàng
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { $set: payload },
            { new: true, runValidators: true }
        ).populate('customer');

        if (!updatedOrder) {
            throw createError(404, 'Không tìm thấy đơn hàng');
        }

        return updatedOrder;
    } catch (error) {
        throw error;
    }
}
const deleteByID = async (id: string) => {
    const order = await findByID(id);
    await Order.deleteOne({ _id: order._id })
    return order;
}
export default {
    findAll,
    findByID,
    createRecord,
    updateByID,
    deleteByID
}