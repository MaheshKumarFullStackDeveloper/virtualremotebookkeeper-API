import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from 'dotenv';
import { RequestHandler } from 'express';
import streamifier from 'streamifier'; // you'll need to install this

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// Memory storage
const storage = multer.memoryStorage();
const multerMiddleware: RequestHandler = multer({ storage }).array('images', 4);

const uploadToCloudinary = (buffer: Buffer): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result as UploadApiResponse);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

const deleteFromCloudinary = (publicId: string): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) return reject(error);
            resolve(result as UploadApiResponse);
        });
    });
};

export { multerMiddleware, uploadToCloudinary, deleteFromCloudinary };