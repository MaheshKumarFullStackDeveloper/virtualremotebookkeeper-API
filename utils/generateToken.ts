import jwt from "jsonwebtoken"
import { IUSER } from "../models/User"

export const generateToken = (user: IUSER): string => {
    return jwt.sign({ userId: user?.id }, process.env.JWT_SECRET as string, { expiresIn: '6h' })

} 