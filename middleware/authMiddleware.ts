
import { NextFunction, Request, Response } from "express";
import { response } from "../utils/responseHandler";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}

/* check access token is store in cookies. if not find spacific access token in cookes then it return false */
/* const authenticatedUser = async(req:Request,res:Response,next:NextFunction)=>{
    const token = req.cookies.access_token;

    if(!token){
        return response(res,401,'user is not authenticate, or not token available ');
    }

    try{
   
     const decode=  jwt.verify(token,process.env.JWT_SECRET as string) as jwt.JwtPayload;
     if(!decode){
        return response(res,401,'user is not authenticate, or user not Found ');
     }

     req.id= decode.userId;
     next();
    }catch(error){
        return response(res,401,'Not authenticate');
    }
} */

const authenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return response(res, 434, "Token verification failed");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        req.id = decoded.userId;
        next();
    } catch (error) {
        return response(res, 434, "Token verification failed");
    }
};



export { authenticatedUser };