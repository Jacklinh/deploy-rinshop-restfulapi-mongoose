import { TypeCarousel } from "../types/models";
import {Schema, model} from "mongoose";
const CarouselSchema = new Schema<TypeCarousel>({
    images: {
        type: [String],
        required: false
    },
    active: {
        type: Boolean,
        default: false,
        required: false
    }
},{
    timestamps: true
});
const Caurousel = model<TypeCarousel>("Carousel",CarouselSchema);
export default Caurousel