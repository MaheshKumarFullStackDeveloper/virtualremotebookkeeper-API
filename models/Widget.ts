import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export interface IWidget extends Document {

    title: string;
    content: string;
}

const widgetSchema = new Schema<IWidget>({
    title: { type: String, required: true, },
    content: { type: String, required: true },

}, { timestamps: true })


export default mongoose.model<IWidget>('Widget', widgetSchema)
