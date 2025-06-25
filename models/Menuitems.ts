import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export interface IMenuitem extends Document {

    parent?: mongoose.Types.ObjectId;
    title: string;
    link: string;
    order?: number;
    menu?: mongoose.Types.ObjectId;
}

const menuitemSchema = new Schema<IMenuitem>({
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Menuitem", default: null },
    title: { type: String, required: true, },
    link: { type: String, required: true },
    order: { type: Number, default: 0 },

    menu: { type: Schema.Types.ObjectId, ref: 'Menu' },

}, { timestamps: true })


export default mongoose.model<IMenuitem>('Menuitem', menuitemSchema)
