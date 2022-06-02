import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  IsMongoId,
} from "class-validator";

import { Schema as MongooseSchema } from "mongoose";
export class CreateUserServiceDto {
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  fName: string;

  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  lName: string;

  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  officeName: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  email: string;

  @IsOptional()
  pNumber: number;

  @IsOptional()
  pin: number;

  @IsOptional()
  lat: number;


  @IsOptional()
  lng: number;


  @IsOptional()
  university: string;

  @IsOptional()
  address: string;

  @IsOptional()
  city: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  password: string;

  @IsNotEmpty()
  RoleId: string;

  @IsOptional()
  @MaxLength(500)
  profilePicture?: string;

  @IsOptional()
  //UserId: string;
  //@IsNotEmpty()
  @IsMongoId()
  OfficeId: MongooseSchema.Types.ObjectId;

}
