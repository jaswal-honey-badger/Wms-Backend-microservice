import { Type } from "class-transformer";
import {
  IsNumber,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsString,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested
} from "class-validator";
import { SeoDto } from "src/shared/dto/seo.dto";

export class CreateCategoryDto {
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  name: string;

  @IsNotEmpty()
  @MaxLength(200)
  @IsString()
  summary: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsOptional()
  @IsNumber()
  priority: number;

  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  slug: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => SeoDto)
  seo: SeoDto;
}
