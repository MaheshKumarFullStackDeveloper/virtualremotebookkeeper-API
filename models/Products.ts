import mongoose,  {Document} from "mongoose";
 
const { Schema } = mongoose;

export interface IProduct extends Document {

 title :string;
 images :string[];
 subject :string;
 category :string;
 condition :string;
 classType :string;
 price:number; 
 author:string;
 edition?:string;
 description?:string;
finalPrice:number;
shippingCharge:string;
seller:mongoose.Types.ObjectId;
paymentMode:'UPI'|'Bank Account';
paymentDetails:{
    upi?:string;
    bankDetails?:{
        accountNumber:string;
        ifscCode:string;
        bankName:string;

    }
}
}

const productSchema= new Schema<IProduct>({
    title: { type: String , required: true,},
    category: { type: String, required: true},
    condition: { type: String, required: true },
    classType: { type: String, required: true },
    author: { type: String, required: true },
    subject: { type: String, required: true },
    shippingCharge: { type: String, required: true },
    price: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    paymentMode: { type: String, enum: ['UPI','Bank Account'], required: true  },
    paymentDetails: { upiId:{ type: String }, bankDetails:{
        accountNumber:{ type: String },
        ifscCode:{ type: String },
        bankName:{ type: String }

    }  },
    images : [{ type: String }],
    edition: { type: String,default:null },
    description: { type: String,default:null },
    seller:{ type:mongoose.Schema.Types.ObjectId,ref:'User',required: true }, 
    
},{timestamps:true})    


export default mongoose.model<IProduct>('Product',productSchema)
