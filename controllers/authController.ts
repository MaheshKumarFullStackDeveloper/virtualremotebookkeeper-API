import { Request, Response } from "express"
import User from "../models/User";
import crypto from "crypto";
import { response } from "../utils/responseHandler";
import { sendRestPasswordToEmail, sendVerificationToEmail } from "../config/mailConfig";
import { generateToken } from "../utils/generateToken";

export const register = async(req:Request,res:Response)=> {
  
   try {
     const{name,email,password,agreeTerms}=req.body;
     const existingUser= await User.findOne({email});
     if(existingUser){
        return response(res,400,"User Already exists");
     }
   
     const verificationToken =crypto.randomBytes(20).toString('hex')
  
     const user = new User({name,email,password,agreeTerms,verificationToken})
     console.log("test url 4");
     await user.save();

      const result = await sendVerificationToEmail(email,verificationToken);
      console.log("sendVerificationToEmail",result);
     return response(res,200,"User Registeration successful")
   } catch (error) {
      console.log(error);
      return response(res,500,"internal server Error")
   }
}

export const verifyEmail = async(req:Request,res:Response)=> {
  
   try {
     const {token} =req.params;
   
     const user = await User.findOne({verificationToken:token})
        if(!user){ 
         console.log("invalid verificationToken");
         return response(res,400,"invalid verificationToken")
        }

         user.isVerified= true;
         user.verificationToken= undefined;

         const accessToken =generateToken(user);
         res.cookie('access_token',accessToken,{
            httpOnly:true,
            secure: true,
            domain: process.env.COOKIE_DOMAIN_URL, // Set domain for cross-origin cookies
            sameSite: "none", // Required for cross-site cookies
            maxAge:24 * 60 * 60 * 1000
         });

         await user.save();

         return response(res,200,"User Email Verify successfully. now you can login");
   } catch (error) {
      console.log(error);
      return response(res,500,"internal server Error")
   }
}

export const login = async(req:Request,res:Response)=> {
  
   try {
      const{email,password}=req.body;
      const user= await User.findOne({email});
      if(!user || !(await user.comparePassword(password))){
         return response(res,400,"Invalid User");
      }
      if(!user.isVerified){
         return response(res,400,"User not Verified please check your email");
      }
         const accessToken =generateToken(user);
         res.cookie('access_token',accessToken,{
            httpOnly:true,
              secure: true,
             domain: process.env.COOKIE_DOMAIN_URL, // Set domain for cross-origin cookies
            sameSite: "none", // Required for cross-site cookies

            maxAge:24 * 60 * 60 * 1000
         });

         return response(res,200,"User login successfully.",{user:{name:user.name,email:user.email}});
       
    
   } catch (error) {
      console.log(error);
      return response(res,500,"internal server Error")
   }
}

export const forgotPassword = async(req:Request,res:Response)=> {
  
   try {
     const{email}=req.body;
     const user= await User.findOne({email});
     if(!user){
        return response(res,400,"Email not exists");
     }
   
     const resetPasswordToken =crypto.randomBytes(20).toString('hex');
     user.resetPasswordToken=resetPasswordToken;
     user.resetPasswordExpires= new Date(Date.now()+3600000)
     await user.save();

     await sendRestPasswordToEmail(user.email,resetPasswordToken);
     return response(res,200,"Rest password Mail send successfuly");
     
   } catch (error) {
      console.log(error);
      return response(res,500,"internal server Error")
   }
}

export const resetPassword = async(req:Request,res:Response)=> {
  
   try {
      const {token}=req.params;
     const {newPassword}=req.body;
     const user= await User.findOne({resetPasswordToken:token,resetPasswordExpires:{$gt : Date.now()}});
     if(!user){
 
        return response(res,400,"Invalid or expired token");
     }
      
     user.password=newPassword;
     user.resetPasswordToken=undefined;
     user.resetPasswordExpires=undefined;
 
     await user.save();

     return response(res,200,"User Paaaword updated successfully. now you can login");

   } catch (error) {
      console.log(error);
      return response(res,500,"internal server Error")
   }
}

export const logout = async(req:Request,res:Response)=> {
  
   try {
         res.clearCookie("access_token",{
            httpOnly:true
         })
     return response(res,200,"User logout successfully.");

   } catch (error) {
      console.log(error);
      return response(res,500,"internal server Error")
   }
}


export const checkUserAuth = async(req:Request,res:Response)=> {
  
   try {
        
      const userId =req?.id;

      if(!userId){
         return response(res,400,"Unauthenticate please login to access our data");
      }

      const user =await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires -verificationToken')
      if(!user){
         return response(res,403,"User not Found");
      }

      return response(res,201,"User retrived successfully.",user );

   } catch (error) {
      console.log(error);
      return response(res,500,"internal server Error")
   }
}