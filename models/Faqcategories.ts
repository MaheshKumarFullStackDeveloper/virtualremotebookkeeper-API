import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export interface IFaqcategory extends Document {
    title: string;
    slug: string;
    order?: number;
}

const faqcategorySchema = new Schema<IFaqcategory>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },


}, { timestamps: true })


export default mongoose.model<IFaqcategory>('Faqcategory', faqcategorySchema)
