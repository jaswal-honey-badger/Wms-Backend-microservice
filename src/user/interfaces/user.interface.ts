import { Document } from "mongoose";

export interface User extends Document {
  fName: string;
  lName: string;
  email: string;
  password: string;
  RoleId:string;
  OfficeId?: string;
  pNumber: number;
  pin: number;
  lat: number; 
  lng: number ; 
  address: string;
  city: string;
  university: string;
  verification: string;
  verified: boolean;
  isBlocked: boolean;
  verificationExpires: Date;
  loginAttempts?: number;
  phone?: string;
  profilePicture?: string;
  termAndCondition?: boolean;
  info?: object;
}
