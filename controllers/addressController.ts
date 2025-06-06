
import Address from "../models/Address";
import User from "../models/User";
import { response } from "../utils/responseHandler";
import { Request, Response } from "express";


export const createOrUpdateAddressByUserId=  async (req: Request, res: Response) => {
  try { 
    
    const userId= req.id;
    const {addressLine1,addressLine2,phoneNumber,city,state,pincode,addressId} =req.body;
  
    if(!userId){
        return response(res, 400, "User Id not found ");
       }

      if(!addressLine1 || !addressLine2 || !phoneNumber || !city || !state || !pincode){
        return response(res, 400, "Please Fill all value for add new address");
      } 

      if(addressId){
          const existAddreess = await Address.findById(addressId);
          if(!existAddreess){
            return response(res, 400, "Addrees not found ");
           }
           existAddreess.addressLine1=addressLine1;
           existAddreess.addressLine2=addressLine2;
           existAddreess.phoneNumber=phoneNumber;
           existAddreess.city=city;
           existAddreess.state=state;
           existAddreess.pincode=pincode;

           await existAddreess.save();

           return response(res, 200, "Addrees update successfully");
      }else{

        const newAddress = new Address({
           user:userId,addressLine1,addressLine2,phoneNumber,city,state,pincode
        });
        await newAddress.save();
          
        await User.findByIdAndUpdate(userId,{$push: {addresses:newAddress._id}},{new:true})
        return response(res, 200, "Addrees added successfully");
      }
     
      } catch (error) {
        console.log(error);
        return response(res, 500, "internal server Error");
      }
    };
  

 
export const getAddressByIserId=  async (req: Request, res: Response) => {
    try { 
      
      const userId= req.id;
      if(!userId){
          return response(res, 400, "User Id not found ");
         }
  
            const addreess = await User.findById(userId).populate('addresses');
         
            if(!addreess){
                return response(res, 400, "user addreess not found ");
               }
             return response(res, 200, "Addrees get successfully",addreess);
      
        } catch (error) {
          console.log(error);
          return response(res, 500, "internal server Error");
        }
      };
       