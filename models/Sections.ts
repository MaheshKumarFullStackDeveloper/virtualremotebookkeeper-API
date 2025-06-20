import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export interface ISection extends Document {
    page: mongoose.Types.ObjectId;
    title: string;
    order: number;
    content: string;
}

const sectionSchema = new Schema<ISection>({
    page: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', required: true },
    title: { type: String },
    order: { type: Number },
    content: { type: String }
}, { timestamps: true })


export default mongoose.model<ISection>('Section', sectionSchema)
