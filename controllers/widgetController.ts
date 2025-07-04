
import Menus from "../models/Menus";
import Widget from "../models/Widget";
import { response } from "../utils/responseHandler";
import { Request, Response } from "express";
import Category from "../models/Categories";

export const createWidget = async (req: Request, res: Response) => {
  try {


    const {
      widgetId,
      title,
      content,
    } = req.body;

    if (!title || !content) {
      return response(res, 400, "Please Fill all value for add or update widget");
    }
    if (widgetId) {


      const existWidgets = await Widget.findById(widgetId);
      if (!existWidgets) {
        return response(res, 400, "Widget not found ");
      }
      existWidgets.title = title;
      existWidgets.content = content;

      await existWidgets.save();

      return response(res, 200, "Widget update successfully");
    } else {


      const widget = new Widget({
        title,
        content,
      });

      await widget.save();

      return response(res, 200, "Widget Created successfully", widget);
    }
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error widget");
  }
};





export const getAllWidgets = async (req: Request, res: Response) => {
  try {

    const page = parseInt(req.params.page as string) || 1;
    const limit = parseInt(req.params.limit as string) || 8;
    const skip = (page - 1) * limit;


    const totalWidgetsCount = await Widget.countDocuments();
    const totalWidgets = Math.ceil(totalWidgetsCount / limit); // Calculate total pages


    const widgetsList = await Widget.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return response(res, 200, "Widgets fetched successfully", { totalWidgetsCount, totalWidgets, widgetsList, page, limit });

  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error widget ");
  }
};




export const getWidgetbyId = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const widget = await Widget.findById(id)

    if (!widget) {
      return response(res, 404, "Widget not found for this id");
    }


    return response(res, 200, "Widget get successfully", widget);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error - widget");
  }
};




export const deleteWidget = async (req: Request, res: Response) => {
  try {


    const widget = await Widget.findByIdAndDelete(req.params.widgetId)

    if (!widget) {
      return response(res, 404, "Widget not found for this id");
    }


    return response(res, 200, "Widget deleted successfully");
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error widget");
  }
};




export const getAllHeaderFooterData = async (req: Request, res: Response) => {
  try {



    const widgetsList = await Widget.find()
      .sort({ createdAt: -1 })
      .lean();

    const menu = await Menus.aggregate([
      {
        $lookup: {
          from: 'menuitems',
          let: { menuId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$menu', '$$menuId'] },
                    { $eq: ['$parent', null] } // Only top-level items
                  ]
                }
              }
            },
            {
              $lookup: {
                from: 'menuitems',
                let: { parentId: '$_id', menuId: '$menu' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$parent', '$$parentId'] },
                          { $eq: ['$menu', '$$menuId'] }
                        ]
                      }
                    }
                  },
                  { $sort: { order: 1 } }
                ],
                as: 'children'
              }
            },
            { $sort: { order: 1 } }
          ],
          as: 'items'
        }
      }
    ]);

    const categoryList = await Category.find().sort({ createdAt: -1 }).lean();

    return response(res, 200, "Widgets fetched successfully", { widgetsList, menu, categoryList });

  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error widget ");
  }
};
