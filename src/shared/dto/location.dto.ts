import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from "class-validator";

export class LocationDto {
  @IsString()
  @IsNotEmpty()
  name: string = "Point";

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  coordinates: Array<Number>
}