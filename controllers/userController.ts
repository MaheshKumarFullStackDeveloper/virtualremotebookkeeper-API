
import User from "../models/User";
import { response } from "../utils/responseHandler";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";


export const createUser = async (req: Request, res: Response) => {
  try {


    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return response(res, 400, "Please Fill all value for add or update user");
    }




    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(res, 400, "User Email Already exists");
    }
    const isVerified = true;
    const agreeTerms = true;
    const user = new User({
      name,
      email,
      password,
      isVerified,
      agreeTerms,
    });

    await user.save();

    return response(res, 200, "User Created successfully", user);

  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error user");
  }
};


export const getAllUsers = async (req: Request, res: Response) => {
  try {

    const user = parseInt(req.query.user as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const skip = (user - 1) * limit;

    const search = req.query.search as string;

    const searchFilter = search
      ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      }
      : {};

    const totalUsersCount = await User.countDocuments(searchFilter);
    const totalUsers = Math.ceil(totalUsersCount / limit); // Calculate total users


    const usersList = await User.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return response(res, 200, "Users fetched successfully", { totalUsersCount, totalUsers, usersList, user, limit });

  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error user ");
  }
};



export const updateUserByUserId = async (req: Request, res: Response) => {
  try {

    const userId = req.id;
    const { name, email } = req.body;

    if (!userId) {
      return response(res, 400, "User Id not found ");
    }


    const user = await User.findById(userId);
    if (!user) {
      return response(res, 400, "User not found ");
    }

    if (!name || !email) {
      return response(res, 400, "Please Fill all value for update user");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser && !new ObjectId(existingUser._id as string).equals(new ObjectId(userId))) {
      return response(res, 400, `User Email Already exists `);
    }



    user.name = name;
    user.email = email;


    await user.save();
    const userdetail = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires -verificationToken');

    return response(res, 200, "User update successfully", userdetail);


  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error user");
  }
};




export const updateUserPasswordByUserId = async (req: Request, res: Response) => {
  try {

    const userId = req.id;
    const { oldpassword, password } = req.body;

    if (!userId) {
      return response(res, 400, "User Id not found ");
    }
    if (!password || !oldpassword) {
      return response(res, 400, "Please Fill all value for update user password");
    }


    const user = await User.findById(userId);
    if (!user) {
      return response(res, 400, "User not found ");
    }

    if (!(await user.comparePassword(oldpassword))) {
      return response(res, 400, `Old Password Invalid`);
    }
    user.password = password;
    await user.save();
    const userdetail = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires -verificationToken');

    return response(res, 200, "User update successfully", userdetail);


  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error user");
  }
};




export const deleteUser = async (req: Request, res: Response) => {
  try {

    if (!req.params.userId) {
      return response(res, 404, "User id not found ");
    }


    const user = await User.findByIdAndDelete(req.params.userId)

    if (!user) {
      return response(res, 404, "User not found for this id");
    }


    return response(res, 200, "User deleted successfully");
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error page");
  }
};