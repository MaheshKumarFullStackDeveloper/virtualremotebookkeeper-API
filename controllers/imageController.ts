import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudnaryConfig";
import { response } from "../utils/responseHandler";
import { Request, Response } from "express";
import Images from "../models/Images";
import { unlink } from 'fs';
import { join } from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node'
/* 
export const uploadPhoto = async (req: Request, res: Response) => {


  try {

    const user = req.id;
    const photos = req.files as Express.Multer.File[];

    if (!photos || photos.length === 0) {
      return response(res, 400, "images is requird");
    }

    const uploadPromise = photos.map((file) => uploadToCloudinary(file as any));
    const uploadImage = await Promise.all(uploadPromise);
    console.log("uploded fies", uploadImage);
    const img = new Images({
      image: uploadImage[0].secure_url,
      public_id: uploadImage[0].public_id,
      user: user,
    });

    await img.save();


    const fileName: string = `${uploadImage[0].original_filename}`; // Get file name from request params
    const uploadsFolder: string = join(__dirname, '../uploads'); // Adjust the path as needed
    const filePath: string = join(uploadsFolder, fileName);
    unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      }
      console.log('File deleted successfully');
    });

    return response(res, 200, "Images uploded successfully", img);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error image");
  }
};


 */


export const getAllImages = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.params.page as string) || 1;
    const limit = parseInt(req.params.limit as string) || 8;
    const skip = (page - 1) * limit;

    const totalImages = await Images.countDocuments();
    const totalPages = Math.ceil(totalImages / limit); // Calculate total pages


    const images = await Images.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return response(res, 200, "Images fetched successfully", { totalImages, totalPages, images, page, limit });

  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};



export const deleteImage = async (req: VercelRequest, res: VercelResponse) => {
  try {

    const image = await Images.findByIdAndDelete(req.params.imageId)

    if (!image) {
      return response(res, 404, "Image not found for this id");
    }

    const deleteResponce = await deleteFromCloudinary(image.public_id as string);
    res.status(200).json({ message: "Image deleted", deleteResponce });

    // return response(res, 200, "Image deleted successfully", deleteResponce);
    return response(res, 200, "Image deleted successfully");
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error image");
  }
};



/* 
export const getImagesByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return response(res, 400, "User Id not found ");
    }

    const images = await Images.find({ user: userId })

    if (!images) {
      return response(res, 404, "Images not found for this user ");
    }
    return response(res, 200, "Images get by user successfully", images);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error image");
  }
};

 */