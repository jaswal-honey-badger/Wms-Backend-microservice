import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException
} from "@nestjs/common";
import { Public } from "src/auth/guards/roles.guard";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { GetCategoriesDto } from "./dto/get-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Permissions } from "../auth/decorators/permissions.decorator";
import { CurrentUser } from "src/auth/decorators/currentUser.decorator";
import { IdRequiredDto } from "src/shared/dto";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Public()
  // @Permissions("Testing", "Hello")
  @Get()
  findAll(@Query() getCategoriesDto: GetCategoriesDto, @CurrentUser() currentUser) {   
    return this.categoryService.findAll(getCategoriesDto);
  }

  @Get(":id")
  findOne(@Param("id") @Param() { id }: IdRequiredDto) {
    return this.categoryService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") @Param() { id }: IdRequiredDto, @Body() updateCategoryDto: UpdateCategoryDto) {
    if (Object.keys(updateCategoryDto).length == 0) {
      throw new BadRequestException("Please provide data to update");        
    }

    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  remove(@Param("id") @Param() { id }: IdRequiredDto) {
    return this.categoryService.remove(id);
  }
}
