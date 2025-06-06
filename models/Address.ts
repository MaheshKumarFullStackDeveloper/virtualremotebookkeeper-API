import mongoose,  {Document} from "mongoose";
 
const { Schema } = mongoose;

export interface IADDRESS extends Document {
 user :mongoose.Types.ObjectId;
 addressLine1 :string;
 addressLine2 :string;
 phoneNumber? :string;
 city? :string;
 state? :string;
 pincode :string;
}

const addressSchema= new Schema<IADDRESS>({
    user:{ type:mongoose.Schema.Types.ObjectId,ref:'User',required: true }, 
    addressLine1: { type: String },
    addressLine2: { type: String },
    phoneNumber: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
},{timestamps:true})    


export default mongoose.model<IADDRESS>('Address',addressSchema)
