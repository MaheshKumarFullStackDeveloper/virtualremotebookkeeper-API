import { uploadToCloudinary } from "../config/cloudnaryConfig";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import { Request, Response } from "express";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      title,
      category,
      condition,
      classType,
      author,
      subject,
      shippingCharge,
      price,
      finalPrice,
      paymentMode,
      paymentDetails,
      edition,
      description,
    } = req.body;
    const sellerId = req.id;
    const images = req.files as Express.Multer.File[];

    if (!images || images.length === 0) {
      return response(res, 400, "images is requird");
    }
  /*   let parsedPaymentsDetails = JSON.parse(paymentDetails);

    if (
      paymentMode === "UPI" &&
      (!parsedPaymentsDetails || !parsedPaymentsDetails.upiId)
    ) {
      return response(res, 400, "UPI id is requird");
    }

    if (
      paymentMode === "Bank Account" &&
      (!parsedPaymentsDetails ||
        !parsedPaymentsDetails.bankDetails ||
        !parsedPaymentsDetails.bankDetails.accountNumber ||
        !parsedPaymentsDetails.bankDetails.ifscCode ||
        !parsedPaymentsDetails.bankDetails.bankName)
    ) {
      return response(res, 400, "Bank Account details is requird");
    }
 */
    const uploadPromise = images.map((file) => uploadToCloudinary(file as any));
    const uploadImages = await Promise.all(uploadPromise);
    const imageUrl = uploadImages.map((image) => image.secure_url);

    const product = new Products({
      title,
      category,
      condition,
      classType,
      author,
      subject,
      shippingCharge,
      price,
      finalPrice,
      paymentMode,
      paymentDetails,
      edition,
      description,
      seller: sellerId,
      images: imageUrl,
    });

    await product.save();

    return response(res, 200, "Product Created successfully", product);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error");
  }
};





export const getAllProducts = async (req: Request, res: Response) => {
    try {
         
       const products = await Products.find().sort({createdAt:-1}).populate('seller','name email')
    console.log("Product get successfully",products);
        return response(res, 200, "Product get successfully", products);
      } catch (error) {
        console.log(error);
        return response(res, 500, "internal server Error");
      }
    };
     


export const getProductbyId = async (req: Request, res: Response) => {
    try {
         
       const product = await Products.findById(req.params.id).populate({
         path:'seller',
         select:'name email profilePicture phoneNumber ',
       /*   populate:{
          path:'addresses',
          select:'Address',
         } */
         
        })

        if(!product){
          return response(res, 404, "Product not found for this id");
        }

    
        return response(res, 200, "Product get successfully", product);
      } catch (error) {
        console.log(error);
        return response(res, 500, "internal server Error");
      }
    };
     


    
export const deleteProduct = async (req: Request, res: Response) => {
  try {
       
     const product = await Products.findByIdAndDelete(req.params.productId)
  
     if(!product){
      return response(res, 404, "Product not found for this id");
    }


      return response(res, 200, "Product deleted successfully");
    } catch (error) {
      console.log(error);
      return response(res, 500, "internal server Error");
    }
  };



  
export const getProductsBySellerId = async (req: Request, res: Response) => {
  try {
       const sellerId=req.params.sellerId;
       if(!sellerId){
        return response(res, 400, "Seller Id not found ");
       }

     const products = await Products.find({seller:sellerId}).sort({createdAt:-1}).populate('seller','name email profilePicture phoneNumber')
  
     if(!products){
      return response(res, 404, "Product not found for this seller ");
    }
      return response(res, 200, "Product get by seller successfully", products);
    } catch (error) {
      console.log(error);
      return response(res, 500, "internal server Error");
    }
  };
   