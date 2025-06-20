
import Pages from "../models/Pages";
import { response } from "../utils/responseHandler";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
export const createPage = async (req: Request, res: Response) => {
  try {


    const {
      pageId,
      title,
      slug,
      status,
      metaTitle,
      metaDescription,
    } = req.body;

    if (!title || !slug || !status || !metaTitle || !metaDescription) {
      return response(res, 400, "Please Fill all value for add or update page");
    }
    if (pageId) {

      const existingPage = await Pages.findOne({ slug });
      if (existingPage && !new ObjectId(existingPage._id as string).equals(new ObjectId(pageId as string))) {
        return response(res, 400, `Page Slug Already exists `);
      }

      const existPages = await Pages.findById(pageId);
      if (!existPages) {
        return response(res, 400, "Page not found ");
      }
      existPages.title = title;
      existPages.slug = slug;
      existPages.status = status;
      existPages.metaTitle = metaTitle;
      existPages.metaDescription = metaDescription;

      await existPages.save();

      return response(res, 200, "Addrees update successfully");
    } else {

      const existingPage = await Pages.findOne({ slug });
      if (existingPage) {
        return response(res, 400, "Page Slug Already exists");
      }
      const page = new Pages({
        title,
        slug,
        status,
        metaTitle,
        metaDescription,
      });

      await page.save();

      return response(res, 200, "Page Created successfully", page);
    }
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error page");
  }
};





export const getAllPages = async (req: Request, res: Response) => {
  try {

    const page = parseInt(req.params.page as string) || 1;
    const limit = parseInt(req.params.limit as string) || 8;
    const skip = (page - 1) * limit;

    const totalPagesCount = await Pages.countDocuments();
    const totalPages = Math.ceil(totalPagesCount / limit); // Calculate total pages


    const pagesList = await Pages.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return response(res, 200, "Pages fetched successfully", { totalPagesCount, totalPages, pagesList, page, limit });

  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error page");
  }
};



export const getPagebySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug
    const page = await Pages.findOne({ slug }).populate({
      path: 'sections',
      select: 'title order content  page ',
      options: { sort: { order: 1 } }
    })

    if (!page) {
      return response(res, 404, "Page not found for this id");
    }


    return response(res, 200, "Page get successfully", page);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error page");
  }
};




export const deletePage = async (req: Request, res: Response) => {
  try {

    const page = await Pages.findByIdAndDelete(req.params.pageId)

    if (!page) {
      return response(res, 404, "Page not found for this id");
    }


    return response(res, 200, "Page deleted successfully");
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error page");
  }
};


