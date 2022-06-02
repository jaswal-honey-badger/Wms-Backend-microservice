import { IsOptional, IsNotEmpty, IsMongoId } from "class-validator";

export class DentistIdRequiredDto {
  @IsNotEmpty()
  @IsMongoId()
  DentistId: string;
}