import { Schema, model } from "mongoose";
import { TypeCustomer } from "../types/models";
const customerSchema = new Schema<TypeCustomer>({
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
        unique: false,
        match: /^[0-9]{10}$/
    },
    email: {
        type: String,
        required: true,
        maxlength: 150,
        unique: true,
        match: /.+\@.+\..+/,
    },
    address: {
        type: String,
        maxlength: 255,
        require: false,
        default: null,
    },
    password: {
        type: String,
        maxlength: 255,
        require: false,
        default: null,
        minlength: 8
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
const Customer = model<TypeCustomer>("Customer", customerSchema);
export default Customer
