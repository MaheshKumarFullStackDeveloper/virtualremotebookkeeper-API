import Pages from "../models/Pages";
import Sections from "../models/Sections";
import User from "../models/User";
import { response } from "../utils/responseHandler";
import { Request, Response } from "express";

export const createOrUpdateSectionsByPageId = async (
  req: Request,
  res: Response
) => {

  console.log("check body", req.body);
  try {

    const { pageId, title, order, content, sectionId } = req.body;

    if (!pageId || !title || !order || !content) {
      return response(res, 400, "Please Fill all value for add new address");
    }

    if (sectionId) {
      const existSection = await Sections.findById(sectionId);
      if (!existSection) {
        return response(res, 400, "Section not found ");
      }
      existSection.page = pageId;
      existSection.title = title;
      existSection.order = order;
      existSection.content = content;

      await existSection.save();

      const sectionsList = await Sections.find({ page: pageId }).sort({ order: 1 })
      return response(res, 200, "Section deleted successfully", sectionsList);
    } else {
      const newSection = new Sections({
        page: pageId,
        title,
        order,
        content,
      });
      await newSection.save();

      await Pages.findByIdAndUpdate(
        pageId,
        { $push: { sections: newSection._id } },
        { new: true }
      );
      const sectionsList = await Sections.find({ page: pageId }).sort({ order: 1 })
      return response(res, 200, "Section added successfully", sectionsList);
    }
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error section user");
  }
};

export const getSectionsBypageId = async (req: Request, res: Response) => {
  try {
    if (!req.params.pageId) {
      return response(res, 400, "Section id not found ");
    }
    const pageId = req.params.pageId;
    if (!pageId) {
      return response(res, 400, "Page id not found ");
    }

    const sections = await User.findById(pageId).populate("sections");

    if (!sections) {
      return response(res, 400, "page sections not found ");
    }
    return response(res, 200, "Sections get successfully", sections);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error section user");
  }
};

export const deleteSection = async (req: Request, res: Response) => {
  try {
    if (!req.params.sectionId) {
      return response(res, 400, "Section id not found ");
    }
    const section = await Sections.findByIdAndDelete(req.params.sectionId);

    if (!section) {
      return response(res, 404, "Section not found for this id");
    }

    await Pages.findByIdAndUpdate(
      section.page, { $pull: { sections: req.params.sectionId } }, { new: true }
    );
    const sectionsList = await Sections.find({ page: section.page }).sort({ order: 1 })
    return response(res, 200, "Section deleted successfully", sectionsList);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error section user");
  }
};
