import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePlaceDto } from './place.dto';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) { }

  @Post('upload-place')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
      @UploadedFile() file: Express.Multer.File,
      @Body() place: CreatePlaceDto,
  ) {
      if (!file) {
          throw new Error('No file uploaded');
      }
      return this.placeService.uploadPlaceAndImage(file, place);
  }

  @Post('upload-video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
      @UploadedFile() file: Express.Multer.File,
      @Body() place: CreatePlaceDto,
  ) {
      return this.placeService.uploadPlaceAndVideo(file, place);
  }

  @Get()
  async getAll() {
      return this.placeService.getAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
      return this.placeService.findById(id);
  }
}