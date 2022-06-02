import { IsEnum, IsNotEmpty, Matches, MaxLength } from "class-validator";

export class GenerateSignedUrlDto {
  @IsNotEmpty()
  @MaxLength(500)
  @Matches(/\.(jpe?g|png|webp|mp4|3gp)$/i, {
    message: "Only jpg, jpeg, png, mp4 and 3gp files are allowed."
  })
  name: string;

  @IsNotEmpty()
  @IsEnum(["private", "public-read", "public-read-write", "authenticated-read"])
  access: string;
}
