import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Attendance, AttendanceDocument } from "src/attendance/entities/attendance.entity";
@Injectable()
export class AttendanceService {

  constructor(
    @InjectModel(Attendance.name) private readonly attendanceModel: Model<AttendanceDocument>
  ) { }

  create(createAttendanceDto: CreateAttendanceDto) {
    const createAttendance = new this.attendanceModel(createAttendanceDto);
    return createAttendance.save();
  }

  findAll(where = {}) {
    return this.attendanceModel.find(where).exec();
    
  }

  findOne(id: string) {
    return this.attendanceModel.findById(id).exec();
    
  }

  remove(id: string) {
    return this.attendanceModel.deleteOne({ _id: id }).exec();
    
  }

  update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceModel.updateOne({ _id: id }, updateAttendanceDto).exec();
    
  }
}
