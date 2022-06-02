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
export class CreateAttendanceDto {

    @IsOptional()
    //@IsDateString()
    inTime: string;

    @IsOptional()
    //@IsDateString()
    outTime: string;

    @IsOptional()
    //@IsDateString()
    date: string;

    @IsOptional()
    //@IsDateString()
    day: number;

    @IsOptional()
    lat: number;

    @IsOptional()
    lng: number;

    @IsOptional()
    status: string;

    
    @IsEnum(["pin", "thumb"])
    @IsOptional()
    entery: string;

    @IsEnum(["in", "out"])
    @IsOptional()
    location: string;

    @IsOptional()
    isVerified: boolean;

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
  
