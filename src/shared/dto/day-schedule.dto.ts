import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Min, Max, IsObject, ValidateNested } from "class-validator";

class TimeObjectDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(23)
  hour: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(59)
  minute: number;
}

export class DayScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(7)
  day: number;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TimeObjectDto)
  startTime: TimeObjectDto

  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TimeObjectDto)
  endTime: TimeObjectDto
}