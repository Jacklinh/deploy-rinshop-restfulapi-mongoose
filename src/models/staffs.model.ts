import { Schema, model } from "mongoose";
import { TypeStaff,EnumRole } from "../types/models";
const staffSchema = new Schema<TypeStaff>({
    fullName: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true,
        minlength: 5
    },
    phone: {
        type: String,
        maxlength: 10,
        match: /^[0-9]{10}$/
    },
    email: {
        type: String,
        required: true,
        maxlength: 150,
        unique: true,
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        maxlength: 255,
        require: false,
        default: null,
        minlength: 8
    },
    role: {
        type: String, 
        enum: Object.values(EnumRole),
        default: EnumRole.USER 
    },
    /* status  */
    active: {
        type: Boolean,
        default: true,
        require: false
    },
},{ 
    timestamps: true 
})
// tạo 1 thuộc tính ảo fullname
// staffSchema.virtual('fullName').get(function () {
//     return this.first_name + ' ' + this.last_name;
// });
// tăng tính bảo mật cho password dùng bcrypt
// staffSchema.pre('save', async function (next) {
//     const staff = this;
//     const hash = bcrypt.hashSync(staff.password, saltRounds);
//     staff.password = hash;
  
//     next();
//   });



const Staff = model<TypeStaff>("Staff", staffSchema);
export default Staff
