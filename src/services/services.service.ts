import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServiceDto } from './dto/create-service.dto';
import { GetServiceDto } from './dto/get-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service, ServiceDocument } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name)
    private readonly ServiceModel: Model<ServiceDocument>
  ) { }


  create(createServiceDto: CreateServiceDto) {
    const createService = new this.ServiceModel(createServiceDto);
    return createService.save();
  }

  findAll(getServiceDto: GetServiceDto) {
    try {
      const where = {};

      if (getServiceDto.s) {
        if (!where["$or"]) where["$or"] = [];

        where["$or"].push(
          { name: new RegExp(getServiceDto.s, "i") }
        )
      }

      if (getServiceDto.identifier) {
        where['identifier'] = getServiceDto.identifier;
      }

      return this.ServiceModel.find()
        .where(where)
        .sort([[getServiceDto.sb, getServiceDto.sd]])
        .skip(Number(getServiceDto.o))
        .limit(Number(getServiceDto.l))
        .exec();
    } catch (error) {
      return [];
    }
  }

  findOne(id: string) {
    return this.ServiceModel.findById(id).exec();
  }

  async remove(id: string) {
    try {
      await this.ServiceModel.deleteOne({ _id: id }).exec();
      return true;
    } catch (error) {
      throw new BadRequestException("Record could not be deleted");
    };
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    try {
      await this.ServiceModel.updateOne({ _id: id }, updateServiceDto).exec();
      return true;
    } catch (error) {
      throw new BadRequestException("Record could not be updated");
    };
  }
}