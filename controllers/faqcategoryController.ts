
import Faqcategory from "../models/Faqcategories";
import { response } from "../utils/responseHandler";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import Faq from "../models/Faq";

export const createFaqcategory = async (req: Request, res: Response) => {


  try {


    const {
      categoryId,
      title,
      slug,
    } = req.body;

    if (!title || !slug) {
      return response(res, 400, "Please Fill all value for add or update category");
    }
    if (categoryId) {

      const existingFaqcategory = await Faqcategory.findOne({ slug });
      if (existingFaqcategory && !new ObjectId(existingFaqcategory._id as string).equals(new ObjectId(categoryId as string))) {
        return response(res, 400, `Faq category Slug Already exists `);
      }

      const existFaqcategory = await Faqcategory.findById(categoryId);
      if (!existFaqcategory) {
        return response(res, 400, "Faq category not found ");
      }
      existFaqcategory.title = title;
      existFaqcategory.slug = slug;

      await existFaqcategory.save();

      return response(res, 200, "Faq category update successfully");
    } else {

      const existingFaqcategory = await Faqcategory.findOne({ slug });
      if (existingFaqcategory) {
        return response(res, 400, "Faq category Slug Already exists");
      }
      const category = new Faqcategory({
        title,
        slug,
      });

      await category.save();

      return response(res, 200, "Faq category Created successfully", category);
    }
  } catch (error) {

    console.log(error);
    return response(res, 500, "internal server Error category", error);
  }
};





export const getAllFaqcategory = async (req: Request, res: Response) => {
  try {

    const page = parseInt(req.params.page as string) || 1;
    const limit = parseInt(req.params.limit as string) || 8;
    const skip = (page - 1) * limit;


    const totalFaqcategoryCount = await Faqcategory.countDocuments();
    const totalFaqcategory = Math.ceil(totalFaqcategoryCount / limit); // Calculate total pages


    const categoryList = await Faqcategory.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return response(res, 200, "Faq category fetched successfully", { totalFaqcategoryCount, totalFaqcategory, categoryList, page, limit });

  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error category");
  }
};



export const getFaqcategorybySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug
    const category = await Faqcategory.findOne({ slug })
    if (!category) {
      return response(res, 404, "Faq category not found for this id");
    }


    return response(res, 200, "Faq category get successfully", category);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error category");
  }
};




export const deleteFaqcategory = async (req: Request, res: Response) => {
  try {


    if (!req.params.categoryId) {
      return response(res, 404, "Faq category not resive ");
    }

    await Faq.updateMany(
      { categories: req.params.categoryId },
      { $pull: { categories: req.params.categoryId } }
    );

    const category = await Faqcategory.findByIdAndDelete(req.params.categoryId)

    if (!category) {
      return response(res, 404, "Faq category not found for this id");
    }


    return response(res, 200, "Faqcategory deleted successfully");
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error category");
  }
};


