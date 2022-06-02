import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type ServiceDocument = Service & Document;

@Schema({timestamps: true})
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true})
  identifier: string;

  @Prop({ required: true })
  attributes: string[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
