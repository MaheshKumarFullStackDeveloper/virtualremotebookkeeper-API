
import Blogs from "../models/Blogs";
import Category from "../models/Categories";
import { response } from "../utils/responseHandler";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

export const createCategory = async (req: Request, res: Response) => {


  try {


    const {
      categoryId,
      title,
      slug,
      status,
      metaTitle,
      metaDescription,
    } = req.body;

    if (!title || !slug || !status || !metaTitle || !metaDescription) {
      return response(res, 400, "Please Fill all value for add or update category");
    }
    if (categoryId) {

      const existingCategory = await Category.findOne({ slug });
      if (existingCategory && !new ObjectId(existingCategory._id as string).equals(new ObjectId(categoryId as string))) {
        return response(res, 400, `Category Slug Already exists `);
      }

      const existCategory = await Category.findById(categoryId);
      if (!existCategory) {
        return response(res, 400, "Category not found ");
      }
      existCategory.title = title;
      existCategory.slug = slug;
      existCategory.status = status;
      existCategory.metaTitle = metaTitle;
      existCategory.metaDescription = metaDescription;

      await existCategory.save();

      return response(res, 200, "Category update successfully");
    } else {

      const existingCategory = await Category.findOne({ slug });
      if (existingCategory) {
        return response(res, 400, "Category Slug Already exists");
      }
      const category = new Category({
        title,
        slug,
        status,
        metaTitle,
        metaDescription,
      });

      await category.save();

      return response(res, 200, "Category Created successfully", category);
    }
  } catch (error) {

    console.log(error);
    return response(res, 500, "internal server Error category", error);
  }
};





export const getAllCategory = async (req: Request, res: Response) => {
  try {

    const page = parseInt(req.params.page as string) || 1;
    const limit = parseInt(req.params.limit as string) || 8;
    const skip = (page - 1) * limit;


    const totalCategoryCount = await Category.countDocuments();
    const totalCategory = Math.ceil(totalCategoryCount / limit); // Calculate total pages


    const categoryList = await Category.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return response(res, 200, "Category fetched successfully", { totalCategoryCount, totalCategory, categoryList, page, limit });

  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error category");
  }
};



export const getCategorybySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug
    const category = await Category.findOne({ slug })
    if (!category) {
      return response(res, 404, "Category not found for this id");
    }


    return response(res, 200, "Category get successfully", category);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error category");
  }
};




export const deleteCategory = async (req: Request, res: Response) => {
  try {

    if (!req.params.categoryId) {
      return response(res, 404, "Category not resive ");
    }

    await Blogs.updateMany(
      { categories: req.params.categoryId },
      { $pull: { categories: req.params.categoryId } }
    );
    const category = await Category.findByIdAndDelete(req.params.categoryId)

    if (!category) {
      return response(res, 404, "Category not found for this id");
    }


    return response(res, 200, "Category deleted successfully");
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error category");
  }
};


