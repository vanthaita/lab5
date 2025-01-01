import { Module } from '@nestjs/common';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
