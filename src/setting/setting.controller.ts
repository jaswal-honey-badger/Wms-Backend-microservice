import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { SettingService } from "./setting.service";
import { UpdateSettingDto } from "./dto/update-setting.dto";

@Controller("setting")
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  findAll() {
    return this.settingService.findAll();
  }

  @Get(":key")
  findOne(@Param("key") key: string) {
    return this.settingService.findOneByKey(key);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingService.update(id, updateSettingDto);
  }
}
