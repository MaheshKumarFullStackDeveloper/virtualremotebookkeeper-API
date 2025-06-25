import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export interface IMenu extends Document {
    title: string;
}

const MenuSchema = new Schema<IMenu>({
    title: { type: String, required: true },

}, { timestamps: true })


export default mongoose.model<IMenu>('Menu', MenuSchema)
