import { TypeCategory } from "../types/models";
import {Schema, model} from "mongoose";
import createError from "http-errors";
import { buildSlug } from "../helpers/buildSlug";
const categorySchema = new Schema<TypeCategory>({
    category_name: {
        type: String,
        maxLength: 50,
        unique: true,
        trim: true,
        required: true
    },
    description: {
        type: String,
        maxLength: 255,
        required: false
    },
    slug:{
        type: String,
        maxLength: 50,
        trim: true,
        required: false
    },
    banner: {
        type: String,
        maxLength: 255,
        required: false
    }
},{
    timestamps: true
});
categorySchema.pre('validate', async function(next){
    if(!this.category_name){
        throw createError(400,"category name not fould")
    }
    this.slug = buildSlug(this.category_name);
    next();
})
const Category = model<TypeCategory>("Category",categorySchema);
export default Category