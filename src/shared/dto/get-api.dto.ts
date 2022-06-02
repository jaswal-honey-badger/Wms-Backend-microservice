import { IsOptional, MaxLength } from "class-validator";

export class GetApiDto {
  @IsOptional()
  @MaxLength(100)
  s: string;

  @IsOptional()
  sb: string;

  @IsOptional()
  sd: string;

  @IsOptional()
  l: number = 50;

  @IsOptional()
  o: number = 0;
}
