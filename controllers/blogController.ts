
import Blog from "../models/Blogs";
import { response } from "../utils/responseHandler";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

export const createBlog = async (req: Request, res: Response) => {
  try {


    const {
      blogId,
      title,
      slug,
      image,
      categories,
      content,
      status,
      metaTitle,
      metaDescription,
    } = req.body;

    if (!title || !slug || !status || !metaTitle || !content || !image || !categories || !metaDescription) {
      return response(res, 400, "Please Fill all value for add or update blog");
    }
    if (blogId) {

      const existingBlog = await Blog.findOne({ slug });
      if (existingBlog && !new ObjectId(existingBlog._id as string).equals(new ObjectId(blogId as string))) {
        return response(res, 400, `Blog Slug Already exists `);
      }

      const existBlogs = await Blog.findById(blogId);
      if (!existBlogs) {
        return response(res, 400, "Blog not found ");
      }
      existBlogs.title = title;
      existBlogs.slug = slug;
      existBlogs.content = content;
      existBlogs.image = image;
      existBlogs.categories = categories;
      existBlogs.status = status;
      existBlogs.metaTitle = metaTitle;
      existBlogs.metaDescription = metaDescription;

      await existBlogs.save();

      return response(res, 200, "Blog update successfully");
    } else {

      const existingBlog = await Blog.findOne({ slug });
      if (existingBlog) {
        return response(res, 400, "Blog Slug Already exists");
      }
      const blog = new Blog({
        title,
        slug,
        categories,
        content,
        status,
        image,
        metaTitle,
        metaDescription,
      });

      await blog.save();

      return response(res, 200, "Blog Created successfully", blog);
    }
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error blog");
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const skip = (page - 1) * limit;

    const search = req.query.search as string;

    const searchFilter = search
      ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      }
      : {};

    const totalBlogsCount = await Blog.countDocuments(searchFilter);
    const totalBlogs = Math.ceil(totalBlogsCount / limit);

    const blogsList = await Blog.find(searchFilter)
      .select('title status slug image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return response(res, 200, "Blogs fetched successfully", {
      totalBlogsCount,
      totalBlogs,
      blogsList,
      page,
      limit,
    });
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error while fetching blogs");
  }
};



export const getBlogbySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug
    const blog = await Blog.findOne({ slug }).populate({
      path: 'categories',
      select: '_id',
    })

    if (!blog) {
      return response(res, 404, "Blog not found for this id");
    }


    return response(res, 200, "Blog get successfully", blog);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error - blog");
  }
};




export const deleteBlog = async (req: Request, res: Response) => {
  try {

    const blog = await Blog.findByIdAndDelete(req.params.blogId)

    if (!blog) {
      return response(res, 404, "Blog not found for this id");
    }


    return response(res, 200, "Blog deleted successfully");
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server Error blog");
  }
};


