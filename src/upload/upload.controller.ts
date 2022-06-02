import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { GenerateSignedUrlDto } from "./dto/generate-signed-url.dto";
import { CurrentUser } from "src/auth/decorators/currentUser.decorator";

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  async generatePresignedUrl(@Body() generateSignedUrlDto: GenerateSignedUrlDto, @CurrentUser() currentUser) {
    return this.uploadService.create(generateSignedUrlDto, "");
  }
}
