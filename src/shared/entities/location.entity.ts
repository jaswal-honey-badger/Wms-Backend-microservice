import { Prop } from "@nestjs/mongoose";

export class Location {
  @Prop({ required: true, default: "Point" })
  name: string;

  @Prop({ required: true })
  coordinates: Array<Number>;
}
