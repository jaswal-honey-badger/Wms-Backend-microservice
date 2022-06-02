import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Leave, LeaveDocument } from "src/leave/entities/leave.entity";
@Injectable()
export class LeaveService {

  constructor(
    @InjectModel(Leave.name) private readonly leaveModel: Model<LeaveDocument>
  ) { }

  create(createLeaveDto: CreateLeaveDto) {
    const createLeave = new this.leaveModel(createLeaveDto);
    return createLeave.save();
  }

  findAll(where = {}) {
    return this.leaveModel.find(where).exec();
    
  }

  findOne(id: string) {
    return this.leaveModel.findById(id).exec();
    
  }

  remove(id: string) {
    return this.leaveModel.deleteOne({ _id: id }).exec();
    
  }

  update(id: string, updateLeaveDto: UpdateLeaveDto) {
    return this.leaveModel.updateOne({ _id: id }, updateLeaveDto).exec();
    
  }}
