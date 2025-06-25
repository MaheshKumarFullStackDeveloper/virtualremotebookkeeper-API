import multer from "multer";
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";
import dotenv from 'dotenv';

import { RequestHandler } from 'express';

dotenv.config();
/* cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string
}); */

cloudinary.config({
    cloud_name: 'dicsf3f7g',
    api_key: '933391879219588',
    api_secret: '5BJ5pA19xc1_9yYGXbroomSdoJA'
});


interface CustomFile extends Express.Multer.File {
    path: string;
}


const uploadToCloudinary = (file: CustomFile): Promise<UploadApiResponse> => {
    const options: UploadApiOptions = {
        resource_type: 'image'
    }

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path, options, (error, result) => {
            if (error) {
                return reject(error)
            }
            resolve(result as UploadApiResponse)
        })
    })
}


const deleteFromCloudinary = (publicId: string): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result as UploadApiResponse);
        });
    });
};

const multerMiddleware: RequestHandler = multer({ dest: "uploads" }).array('images', 4)

export { multerMiddleware, uploadToCloudinary, deleteFromCloudinary }