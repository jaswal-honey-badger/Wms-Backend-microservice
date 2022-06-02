import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Schema as MongooseSchema } from "mongoose";
import * as MimeTypes from "mime-types";
import { AwsService } from "src/shared/services/aws/aws.service";
import { UtilService } from "src/shared/services/util/util.service";
import { CreateUploadDto } from "./dto/create-upload.dto";
import { GenerateSignedUrlDto } from "./dto/generate-signed-url.dto";

import { UploadTemp, UploadTempDocument } from "./entities/upload.entity";

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(UploadTemp.name)
    private readonly uploadModel: Model<UploadTempDocument>,
    private awsService: AwsService
  ) { }

  async create(generateSignedUrlDto: GenerateSignedUrlDto, UserId: any) {
    try {
      const fileName = UtilService.cleanAndUniqueFileName(generateSignedUrlDto.name);
      const mimeType = MimeTypes.lookup(fileName);
      const key = "uploads/" + fileName;
      const s3Location: string = this.awsService.getPreSignedUrl(key, mimeType, generateSignedUrlDto.access);

      const createUploadDto: CreateUploadDto = new CreateUploadDto();
      // createUploadDto.CreatedBy = UserId;
      createUploadDto.access = generateSignedUrlDto.access;
      createUploadDto.key = key;
      createUploadDto.name = fileName;
      createUploadDto.type = mimeType;
      createUploadDto.location = UtilService.removeQueryString(s3Location);

      const createdUpload = await new this.uploadModel(createUploadDto).save();

      return {
        CreatedBy: createUploadDto.CreatedBy,
        access: createdUpload.access,
        key: createdUpload.key,
        name: createdUpload.name,
        type: createdUpload.type,
        location: s3Location
      }
    } catch (error) {
      console.log(error);
      
      throw new BadRequestException("File could not be uploaded");
    }
  }

  findAll(where = {}) {
    return this.uploadModel.find(where).exec();
  }

  findOne(id: string) {
    return this.uploadModel.findById(id).exec();
  }

  async setInUse(location: string | string[]): Promise<boolean | UploadTemp> {
    try {
      let locations = []
      if (typeof location === "string") locations.push(location);
      else locations = location;

      await this.uploadModel.updateMany({ location: { $in: locations } }, { inUse: true });

      return true;
    } catch (error) {
      return false;
    }
  }

  async removeFromUse(location: string): Promise<boolean> {
    try {
      const foundRecord = await this.uploadModel.findOne()
        .where({ location: location }).exec();

      if (!foundRecord) return true;

      await this.remove(foundRecord._id);
      this.awsService.deleteObject(foundRecord.key);

      return true;
    } catch (error) {
      return false;
    }
  }

  async removeMultiFromUse(location: string[]): Promise<boolean> {
    try {
      const foundRecords = await this.uploadModel.find()
        .where({ location: { $in: location } }).exec();

      if (!foundRecords || !foundRecords.length) return true;

      await this.removeMany(foundRecords.map(x => x._id));
      this.awsService.deleteObjects(foundRecords.map(x => x.key));

      return true;
    } catch (error) {
      return false;
    }
  }

  private remove(id: string) {
    return this.uploadModel.deleteOne({ _id: id }).exec();
  }

  private removeMany(ids: string[]) {
    return this.uploadModel.deleteMany({ _id: { $in: ids } }).exec();
  }
}
