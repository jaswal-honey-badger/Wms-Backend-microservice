import { Prop } from "@nestjs/mongoose";

class TimeObject {
  @Prop({ min: 0, max: 23 })
  hour: number;

  @Prop({ min: 0, max: 59 })
  minute: number;
}

export class DaySchedule {
  @Prop({ min: 1, max: 7 })
  day: number;

  @Prop()
  startTime: TimeObject;

  @Prop()
  endTime: TimeObject;
}