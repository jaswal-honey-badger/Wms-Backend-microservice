import { IsNotEmpty, MaxLength, IsString, IsOptional, IsArray, ArrayMinSize } from "class-validator";

export class CreateServiceDto {
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  name: string;

  @IsOptional()
  @MaxLength(50)
  @IsString()
  identifier: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  attributes: string[];
}
