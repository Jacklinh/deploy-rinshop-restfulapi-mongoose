
import createError from 'http-errors';
import Staff from '../models/staffs.model';
import { TypeStaff } from '../types/models';
const findAll = async (query: any) => {
    /* Phân trang */
    const page_str = query.page;
    const limit_str = query.limit;
    const page = page_str ? parseInt(page_str) : 1;
    const limit = limit_str ? parseInt(limit_str) : 5;
    const offset = (page - 1) * limit;
    
    /* end phan trang */
    /* Sắp xếp */
    let objSort: any = {};
    const sortBy = query.sort || 'updateAt'; // Mặc định sắp xếp theo ngày tạo giảm dần
    const orderBy = query.order && query.order == 'ASC' ? -1: 1;
    objSort = {...objSort, [sortBy]: orderBy} // Thêm phần tử sắp xếp động vào object {}
    /* search theo tên */
    let objectFilter: any = {};
    // fillter by role
    if(query.role) {
        objectFilter.role = query.role;
    }
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
    
    /* Select * FROM staffs */
    const staffs = await Staff
    .find(objectFilter)
    .sort(objSort)
    .select('-__v -password')
    .skip(offset)
    .limit(limit);
    //Đếm tổng số record hiện có của collection
    const totalRecords = await Staff.countDocuments(objectFilter);
    return {
        staffs_list: staffs,
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
    const staff = await Staff.findById(id).select('-__v');
    if(!staff) {
        throw createError(400,'staffs not found')
    }
    return staff;
}
const createRecord = async (payload: TypeStaff) => {
    const staff = await Staff.create(payload);
    return staff;
}
const updateByID = async (id: string, payload: TypeStaff) => {
    //b1.Kiểm tra sự tồn tại của danh mục có id này
    const staff = await findByID(id);
    //2. Update = cách ghi đè thuộc tính
    Object.assign(staff,payload)
    // 2.3. Lưu vào database
    await staff.save();
    //3. Trả về kết quả
    return staff;
}
const deleteByID = async (id: string) => {
    const staff = await findByID(id);
    await Staff.deleteOne({ _id: staff._id })
    return staff;
}
export default {
    findAll,
    findByID,
    createRecord,
    updateByID,
    deleteByID
}