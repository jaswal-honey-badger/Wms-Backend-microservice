import { MaxLength, IsString, IsOptional } from "class-validator";
import { GetApiDto } from "src/shared/dto/get-api.dto";

export class GetServiceDto extends GetApiDto {
  @MaxLength(100)
  @IsString()
  @IsOptional()
  identifier: string;

  constructor() {
    super();
    this.sb = "name";
    this.sd = "ascending";    
  }

}