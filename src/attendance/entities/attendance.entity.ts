import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { text } from "aws-sdk/clients/customerprofiles";
import { Document } from "mongoose";
import * as mongoose from "mongoose";
export type AttendanceDocument = Attendance & Document;

@Schema()

export class Attendance {

@Prop({ required: false })
inTime: string;

@Prop({ required: false })
outTime: string;

@Prop({ required: false })
date: string;

@Prop({ required: false })
day: number;

@Prop({ required: false })
lat: number;

@Prop({ required: false })
lng: number;

@Prop({ required: false })
status: string;

@Prop({ required: false })
isVerified: boolean;

@Prop({ enum: ["pin", "thumb"], required: false, default: "pin" })
entery: string;

@Prop({ enum: ["in", "out"], required: false, default: "out" })
location: string;

@Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: "User" })
EmployeeId: mongoose.Schema.Types.ObjectId;

@Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: "User" })
OfficeId: mongoose.Schema.Types.ObjectId;

}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
