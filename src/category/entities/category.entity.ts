import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Seo } from "src/shared/entities/seo.entity";
export type CategoryDocument = Category & Document;

@Schema({timestamps: true})
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  thumbnail: string;

  @Prop({ default: 0 })
  priority: number;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: Seo })
  seo: Seo;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
