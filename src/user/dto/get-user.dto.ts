import { IsOptional, IsMongoId, IsString, IsEnum } from "class-validator";
import { GetApiDto } from "src/shared/dto";

export class GetUserDto extends GetApiDto {
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  @IsMongoId()
  roleId: string;

  @IsOptional()
  @IsEnum(['1', '0'])
  verified: string;

  @IsOptional()
  @IsEnum(['1', '0'])
  blocked: string;

  constructor() {
    super();
    this.sb = "createdAt";
    this.sd = "-1";
  }
}
