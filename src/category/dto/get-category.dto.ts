import { MaxLength, IsString, IsOptional } from "class-validator";
import { GetApiDto } from "src/shared/dto/get-api.dto";

export class GetCategoriesDto extends GetApiDto {
  @MaxLength(100)
  @IsString()
  @IsOptional()
  slug: string;

  constructor() {
    super();
    this.sb = "priority";
    this.sd = "ascending";    
  }

}