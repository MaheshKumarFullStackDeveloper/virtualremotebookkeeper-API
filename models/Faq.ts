import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export interface IFaq extends Document {

    title: string;
    content: string;
    categories?: mongoose.Types.ObjectId[];
}

const faqSchema = new Schema<IFaq>({
    title: { type: String, required: true, },
    content: { type: String, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Faqcategory' }],

}, { timestamps: true })


export default mongoose.model<IFaq>('Faq', faqSchema)
