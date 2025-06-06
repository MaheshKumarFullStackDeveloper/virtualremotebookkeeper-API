
import Address from "../models/Address";
import User from "../models/User";
import { response } from "../utils/responseHandler";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";


export const updateUserByUserId=  async (req: Request, res: Response) => {
  try { 
    
    const userId= req.id;
    const {name,email} =req.body;
 
    if(!userId){
        return response(res, 400, "User Id not found ");
       }

       
       const user= await User.findById(userId);
       if(!user){
        return response(res, 400, "User not found ");
       }

       if(!name || !email ){
        return response(res, 400, "Please Fill all value for update user");
       } 
     const existingUser= await User.findOne({email});
      if (existingUser && !new ObjectId(existingUser._id as string).equals(new ObjectId(userId))) {
        return response(res,400,`User Email Already exists `);
     }

     

        user.name=name;
        user.email=email;
    

           await user.save();
          const userdetail= await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires -verificationToken');

           return response(res, 200, "User update successfully",userdetail);
     
     
      } catch (error) {
        console.log(error);
        return response(res, 500, "internal server Error");
      }
    };
  

 