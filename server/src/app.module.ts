import { Module } from '@nestjs/common';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PlaceModule } from './places/place.module';

@Module({
  imports: [
    CloudinaryModule,
    PlaceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
