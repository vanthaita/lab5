import { PartialType } from '@nestjs/mapped-types';

export class CreatePlaceDto {
  title: string;
  image: string;
  address?: string;
  latitude?: string;
  longitude?: string;
}

export class UpdatePlaceDto extends PartialType(CreatePlaceDto) {}
