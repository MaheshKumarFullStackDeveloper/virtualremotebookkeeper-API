import mongoose,  {Document} from "mongoose";
 
const { Schema } = mongoose;

export interface IPage extends Document {

 title :string;
 slug :string;
 status :string;
 metaTitle :string;
 metaDescription :string;
 sections? :mongoose.Types.ObjectId[];
}

const pageSchema= new Schema<IPage>({
    title: { type: String , required: true,},
    slug: { type: String, required: true, unique: true},
    status: { type: String, required: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    sections: [{ type:Schema.Types.ObjectId,ref:'Section' }], 
    
},{timestamps:true})    


export default mongoose.model<IPage>('Page',pageSchema)
