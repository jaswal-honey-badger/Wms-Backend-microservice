import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  IsMongoId,
} from "class-validator";

import { Schema as MongooseSchema } from "mongoose";
export class CreateUserDto {
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  readonly fName: string;

  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  readonly lName: string;

  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  readonly officeName: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  readonly email: string;

  @IsOptional()
  // @MinLength(5)
  // @MaxLength(255)
  // @IsEmail()
  readonly pNumber: number;

  @IsOptional()
  readonly lat: number;

  @IsOptional()
  readonly lng: number;

  @IsOptional()
  readonly pin: number;

  @IsOptional()
  readonly university: string;

  @IsOptional()
  readonly address: string;

  @IsOptional()
  readonly city: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  readonly password: string;

  @IsNotEmpty()
  readonly role: string;

  @IsOptional()
  @MaxLength(500)
  readonly profilePicture: string;

  @IsOptional()
  //UserId: string;
  //@IsNotEmpty()
  @IsMongoId()
  OfficeId: MongooseSchema.Types.ObjectId;
}
