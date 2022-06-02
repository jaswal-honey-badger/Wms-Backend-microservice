import { Prop } from "@nestjs/mongoose";

export class Media {
  @Prop()
  title: string;

  @Prop({required: true, enum: ["audio", "video", "image"]})
  type: string;

  @Prop({ required: true })
  url: string;
}