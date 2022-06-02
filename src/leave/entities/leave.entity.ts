import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { text } from "aws-sdk/clients/customerprofiles";
import { Document } from "mongoose";
import * as mongoose from "mongoose";
export type LeaveDocument = Leave & Document;

@Schema()
export class Leave {
@Prop({ enum: ["Medical", "Casual","Privilege", "Compensatory Off"], required: false })
leaveType: string;

@Prop({ required: false })
startDate: Date;

@Prop({ required: false })
endDate: Date;

@Prop({ required: false })
date: string;

@Prop({ required: false })
reason: string;

@Prop({ enum: ["Pending", "Approved","Declined"], required: false, default: "Pending" })
status: string;

@Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: "User" })
EmployeeId: mongoose.Schema.Types.ObjectId;

@Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: "User" })
OfficeId: mongoose.Schema.Types.ObjectId;

}

export const LeaveSchema = SchemaFactory.createForClass(Leave);





