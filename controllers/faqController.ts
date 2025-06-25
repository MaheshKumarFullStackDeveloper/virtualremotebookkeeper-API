
import Faq from "../models/Faq";
import { response } from "../utils/responseHandler";
import { Request, Response } from "express";


export const createFaq = async (req: Request, res: Response) => {
  try {


    const {
      faqId,
      title,
      content,
      categories,
    } = req.body;

    if (!title || !content || !categories) {
      return response(res, 400, "Please Fill all value for add or update faq");
    }
    if (faqId) {


      const existFaqs = await Faq.findById(faqId);
      if (!existFaqs) {
        return response(res, 400, "Faq not found ");
      }
      existFaqs.title = title;
      existFaqs.content = content;
      existFaqs.categories = categories;

      await existFaqs.save();

      return response(res, 200, "Faq update successfully");
    } else {


      const faq = new Faq({
        title,
        content,
        categories,
      });

      await faq.save();

      return response(res, 200, "Faq Created successfully", faq);
    }
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error faq");
  }
};





export const getAllFaqs = async (req: Request, res: Response) => {
  try {

    const page = parseInt(req.params.page as string) || 1;
    const limit = parseInt(req.params.limit as string) || 8;
    const skip = (page - 1) * limit;


    const totalFaqsCount = await Faq.countDocuments();
    const totalFaqs = Math.ceil(totalFaqsCount / limit); // Calculate total pages


    const faqsList = await Faq.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return response(res, 200, "Faqs fetched successfully", { totalFaqsCount, totalFaqs, faqsList, page, limit });

  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error faq ");
  }
};



export const getFaqbyId = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const faq = await Faq.findById(id).populate({
      path: 'faqcategories',
      select: '_id, title',
      options: { sort: { order: 1 } }
    })

    if (!faq) {
      return response(res, 404, "Faq not found for this id");
    }


    return response(res, 200, "Faq get successfully", faq);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error - faq");
  }
};




export const deleteFaq = async (req: Request, res: Response) => {
  try {


    const faq = await Faq.findByIdAndDelete(req.params.faqId)

    if (!faq) {
      return response(res, 404, "Faq not found for this id");
    }


    return response(res, 200, "Faq deleted successfully");
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error faq");
  }
};


