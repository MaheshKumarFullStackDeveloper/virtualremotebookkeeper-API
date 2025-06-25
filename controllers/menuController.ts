
import Menu from "../models/Menus";
import Menuitems from "../models/Menuitems";
import { response } from "../utils/responseHandler";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const createMenu = async (req: Request, res: Response) => {
  try {


    const {
      menuId,
      title,
    } = req.body;

    if (!title) {
      return response(res, 400, "Please Fill all value for add or update menu");
    }
    if (menuId) {


      const existMenus = await Menu.findById(menuId);
      if (!existMenus) {
        return response(res, 400, "Menu not found ");
      }
      existMenus.title = title;

      await existMenus.save();

      return response(res, 200, "menu update successfully");
    } else {


      const menu = new Menu({
        title,
      });

      await menu.save();

      return response(res, 200, "Menus Created successfully", menu);
    }
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error faq");
  }
};




export const getAllMenus = async (req: Request, res: Response) => {
  try {

    const page = parseInt(req.params.page as string) || 1;
    const limit = parseInt(req.params.limit as string) || 8;
    const skip = (page - 1) * limit;


    const totalMenusCount = await Menu.countDocuments();
    const totalMenus = Math.ceil(totalMenusCount / limit); // Calculate total pages


    const menusList = await Menu.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return response(res, 200, "Menus fetched successfully", { totalMenusCount, totalMenus, menusList, page, limit });

  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error Menu ");
  }
};




export const deleteMenu = async (req: Request, res: Response) => {
  try {


    const menu = await Menu.findByIdAndDelete(req.params.menuId)

    const topLevelItems = await Menuitems.find({ menu: req.params.menuId });

    for (const item of topLevelItems) {
      await deleteMenuItemRecursive(item._id as mongoose.Types.ObjectId);
    }
    if (!menu) {
      return response(res, 404, "Menu not found for this id");
    }


    return response(res, 200, "Menu deleted successfully");
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error Menu");
  }
};



async function deleteMenuItemRecursive(itemId: mongoose.Types.ObjectId) {
  // Find child menu items
  const children = await Menuitems.find({ parent: itemId });

  for (const child of children) {
    await deleteMenuItemRecursive(child._id as mongoose.Types.ObjectId);
  }

  // Delete the item itself
  await Menuitems.findByIdAndDelete(itemId);
}



export const createItem = async (req: Request, res: Response) => {
  try {


    const {
      itemId,
      parent,
      title,
      link,
      order,
      menu,
    } = req.body;

    if (!title || !link || !order) {
      return response(res, 400, "Please Fill all value for add or update Item");
    }
    if (itemId && itemId !== "") {


      const existItem = await Menuitems.findById(itemId);
      if (!existItem) {
        return response(res, 400, "Item not found ");
      }
      existItem.title = title;
      existItem.link = link;
      existItem.order = order;
      existItem.menu = menu;

      await existItem.save();

      return response(res, 200, "Item update successfully");
    } else {
      console.log("proccess add new item  ");



      const item = new Menuitems({
        title,
        link,
        order,
        parent,
        menu,
      });

      await item.save();

      return response(res, 200, "Item Created successfully", item);
    }
  } catch (error) {
    console.log(error);
    console.log("item added error ", error);
    return response(res, 500, "internal server Error Item 1");
  }
};





export const deleteItem = async (req: Request, res: Response) => {
  try {


    if (!req.params.itemId) {
      return response(res, 404, "Item ID not found ");
    }


    const subitem = Menuitems.deleteMany({ parent: req.params.itemId })
      .then(result => {
        console.log(`Deleted ${result.deletedCount} menu items`);
      })


    const item = await Menuitems.findByIdAndDelete(req.params.itemId)

    if (!item) {
      return response(res, 404, "Item not found for this id");
    }


    return response(res, 200, "Item deleted successfully");
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error Item 2");
  }
};




export const getALLMenuWithItems = async (req: Request, res: Response) => {
  try {

    const menu = await Menu.aggregate([
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

    if (!menu) {
      return response(res, 404, "Menu not found ");
    }


    return response(res, 200, "Menu get successfully", menu);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error - menu");
  }
};





