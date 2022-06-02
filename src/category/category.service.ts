import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { GetCategoriesDto } from "./dto/get-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category, CategoryDocument } from "./entities/category.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly CategoryModel: Model<CategoryDocument>
  ) { }

  create(createCategoryDto: CreateCategoryDto) {
    const createCategory = new this.CategoryModel(createCategoryDto);
    return createCategory.save();
  }

  findAll(getCategoriesDto: GetCategoriesDto) {
    try {
      const where = {};

      if (getCategoriesDto.s) {
        if (!where["$or"]) where["$or"] = [];

        where["$or"].push(
          { name: new RegExp(getCategoriesDto.s, "i") },
          { summary: new RegExp(getCategoriesDto.s, "i") }
        )
      }

      if (getCategoriesDto.slug) {
        where['slug'] = getCategoriesDto.slug;
      }

      return this.CategoryModel.find()
        .where(where)
        .sort([[getCategoriesDto.sb, getCategoriesDto.sd]])
        .skip(Number(getCategoriesDto.o))
        .limit(Number(getCategoriesDto.l))
        .exec();
    } catch (error) {
      return [];
    }
  }

  findOne(id: string) {
    return this.CategoryModel.findById(id).exec();
  }

  async remove(id: string) {
    try {
      await this.CategoryModel.deleteOne({ _id: id }).exec();
      return true;
    } catch (error) {
      throw new BadRequestException("Record could not be deleted");
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.CategoryModel.updateOne({ _id: id }, updateCategoryDto).exec();
      return true;
    } catch (error) {
      throw new BadRequestException("Record could not be deleted");
    };
  }
}
