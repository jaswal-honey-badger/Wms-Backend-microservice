import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { IdRequiredDto } from 'src/shared/dto';
import { GetServiceDto } from './dto/get-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  findAll(@Query() getServiceDto: GetServiceDto) {
    return this.servicesService.findAll(getServiceDto);
  }

  @Get(':id')
  findOne(@Param("id") @Param() { id }: IdRequiredDto) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  update(@Param("id") @Param() { id }: IdRequiredDto, @Body() updateServiceDto: UpdateServiceDto) {
    if (Object.keys(updateServiceDto).length == 0) {
      throw new BadRequestException("Please provide data to update");        
    }

    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param("id") @Param() { id }: IdRequiredDto) {
    return this.servicesService.remove(id);
  }
}
