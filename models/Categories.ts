import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export interface ICategory extends Document {
    title: string;
    slug: string;
    order?: number;
    content?: string;
    image?: string;
    status: string;
    metaTitle: string;
    metaDescription: string;
}

const categorySchema = new Schema<ICategory>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'active'], required: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    order: { type: Number, default: 0 },
    image: { type: String },
    content: { type: String },

}, { timestamps: true })


export default mongoose.model<ICategory>('Category', categorySchema)
