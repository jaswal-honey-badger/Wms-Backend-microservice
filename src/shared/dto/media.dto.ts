import { IsString, IsOptional, IsNotEmpty, IsEnum } from "class-validator";

export class MediaDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(["audio", "video", "image"])
  type: string = "image";

  @IsNotEmpty()
  @IsString()
  url: string;
}