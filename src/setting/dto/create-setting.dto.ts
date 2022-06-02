import {
  IsNumber,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsNotEmptyObject,
  IsString,
} from "class-validator";

export class CreateSettingDto {
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @MaxLength(100)
  key: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsNumber()
  priority: number;

  @IsNotEmpty()
  @MaxLength(50)
  type: string;

  @IsOptional()
  config: object;

  @IsOptional()
  @IsBoolean()
  isInternal: boolean;
}
