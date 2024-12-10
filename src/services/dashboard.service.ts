import Order from '../models/orders.model';
import Product from '../models/products.model';
import Customer from '../models/customers.model';

// thống kê dữ liệu
const getStatistics = async () => {
    try {
        // tổng số đơn hàng
        const totalOrders = await Order.countDocuments();
        // tổng số sản phẩm
        const totalProducts = await Product.countDocuments();
        // tổng số khách hàng
        const totalCustomers = await Customer.countDocuments();
        // tổng doanh thu tính theo đơn hàng đã giao thành công + đã thanh toán thành công
        // dùng aggregate thống kê dữ liệu
        const totalRevenue = await Order.aggregate([ 
            { $match: // lọc đơn hàng đã giao thành công + đã thanh toán thành công
                { 
                    status: 4, // đã giao thành công
                    payment_status: 2 // đã thanh toán thành công
                }
            },
            { $group: { // gộp tất cả đơn hàng lại
                    _id: null, 
                    total: { $sum: '$total_amount' } // tính tổng doanh thu theo từng đơn hàng
                } 
            }
        ]);
        return {
            totalOrders,
            totalProducts,
            totalCustomers,
            totalRevenue: totalRevenue[0]?.total || 0 
        }
    } catch (error) {
        throw error;
    }
}

// get order mới nhất
const getRecentOrders = async (query: any) => {
    try {
        /* Phân trang */
        const page_str = query.page;
        const limit_str = query.limit;
        const page = page_str ? parseInt(page_str as string): 1;
        const limit = limit_str ? parseInt(limit_str as string): 5;
        const offset = (page - 1) * limit;
        /* Sắp xếp */
        let objSort: any = { createdAt: -1 }; // Mặc định sắp xếp theo ngày mới nhất
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
                    { customer: { $in: customerIds } },
                    { 'order_items.product_name': { $regex: keyword, $options: 'i' } }
                ]
            };
        }
        // Filter theo ngày cụ thể
        if (query.date) {
            // Chuyển đổi ngày bắt đầu về đầu ngày (00:00:00)
            const selectedDate = new Date(query.date);
            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);
            // Chuyển đổi ngày kết thúc về cuối ngày (23:59:59)
            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);

            objectFilter.createdAt = {
                $gte: startOfDay,
                $lte: endOfDay
            };
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
    } catch (error) {
        throw error;
    }
}
// quản lý hàng tồn kho
const getInventory = async () => {
    try {
        const inventory = await Product.aggregate([
            {
                // nhóm dữ liệu 
                $group: {
                    _id: null,
                    // tổng số lượng sản phẩm
                    totalStock: { $sum: '$stock' },
                    // tổng số sản phẩm
                    totalProducts: { $sum: 1 },
                    // tổng số sản phẩm có số lượng ít hơn 10
                    lowStock: {
                        $sum: {
                            $cond: [{ $lt: ['$stock', 10] }, 1, 0]
                        }
                    },
                    // tổng số sản phẩm hết hàng
                    outOfStock: {
                        $sum: {
                            $cond: [{ $lt: ['$stock', 0] }, 1, 0]
                        }
                    }
                }
            },
            {
                // chiếu xuất kết quả
                $project: {
                    _id: 0,
                    totalStock: 1,
                    totalProducts: 1,
                    lowStock: 1,
                    outOfStock: 1,
                    inStock: {
                        $subtract: ['$totalProducts', { $add: ['$lowStock', '$outOfStock'] }]
                    }
                }
            }
        ]);
        return inventory[0] || {
            totalStock: 0,
            totalProducts: 0,
            lowStock: 0,
            outOfStock: 0,
            inStock: 0
        };
    } catch (error) {
        throw error;
    }
}
export default {
    getStatistics,
    getRecentOrders,
    getInventory
}
