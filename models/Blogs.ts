import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export interface IBlog extends Document {

    title: string;
    slug: string;
    image: string;
    status: string;
    metaTitle: string;
    metaDescription: string;
    content: string;
    categories?: mongoose.Types.ObjectId[];
}

const blogSchema = new Schema<IBlog>({
    title: { type: String, required: true, },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    status: { type: String, enum: ['pending', 'active'], required: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    content: { type: String, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],

}, { timestamps: true })


export default mongoose.model<IBlog>('Blog', blogSchema)
