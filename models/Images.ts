import mongoose,  {Document} from "mongoose";
 
const { Schema } = mongoose;

export interface IIMAGE extends Document {
 user :string;
 image :string;
 public_id :string;

}

const imageSchema= new Schema<IIMAGE>({
    user:{ type:String,required: true }, 
    image: { type: String,required: true },
    public_id: { type: String,required: true },
},{timestamps:true})    


export default mongoose.model<IIMAGE>('Image',imageSchema)
