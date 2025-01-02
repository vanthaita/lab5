import { Module } from "@nestjs/common";
import { PlaceController } from "./place.controller";
import { PlaceService } from "./place.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";

@Module({
    imports: [PrismaModule,CloudinaryModule],
    controllers: [PlaceController ],
    providers: [PlaceService,PrismaService],
})

export class PlaceModule {}