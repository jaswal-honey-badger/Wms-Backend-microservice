import {
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from "class-validator";
import { Decimal128 } from "mongoose";
import { Schema as MongooseSchema } from "mongoose";
export class CreateLeaveDto {
  
  @IsEnum(["Medical", "Casual","Privilege", "Compensatory Off"])
  @IsOptional()
  leaveType: string;

  @IsOptional()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;

  
  @IsOptional()
  date: string;

  @IsOptional()
  reason: string;

  @IsEnum(["Pending", "Approved","Declined"])
  @IsOptional()
  status: string;

  @IsOptional()
  //UserId: string;
  //@IsNotEmpty()
  @IsMongoId()
  EmployeeId: MongooseSchema.Types.ObjectId;

  @IsOptional()
  //UserId: string;
  //@IsNotEmpty()
  @IsMongoId()
  OfficeId: MongooseSchema.Types.ObjectId;

}
