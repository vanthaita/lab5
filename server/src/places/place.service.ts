import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreatePlaceDto, UpdatePlaceDto } from './place.dto';

@Injectable()
export class PlaceService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    async uploadPlaceAndImage(file: Express.Multer.File, place: CreatePlaceDto) {
        try {
            const uploadResponse = await this.cloudinaryService.uploadFile(file);
            const savedPlaceAndImage = await this.prismaService.place.create({
                data: {
                    title: place.title,
                    image: uploadResponse.secure_url,
                    address: place.address,
                    latitude: place.latitude,
                    longitude: place.longitude,
                },
            });

            return savedPlaceAndImage;
        } catch (error) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }

    async uploadPlaceAndVideo(file: Express.Multer.File, place: CreatePlaceDto) {
        try {
            const uploadResponse = await this.cloudinaryService.uploadVideo(file);
            const savedPlaceAndVideo = await this.prismaService.place.create({
                data: {
                    title: place.title,
                    image: uploadResponse.secure_url,
                    address: place.address,
                    latitude: place.latitude,
                    longitude: place.longitude,
                },
            });

            return savedPlaceAndVideo;
        } catch (error) {
            throw new Error(`Failed to upload video: ${error.message}`);
        }
    }

    async getAll() {
        console.log(this.prismaService.place.findMany());
        return this.prismaService.place.findMany();
    }

    async findById(id: string) {
        return this.prismaService.place.findUnique({ where: { id } });
    }

    async update(id: string, data: UpdatePlaceDto) {
        return this.prismaService.place.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return this.prismaService.place.delete({ where: { id } });
    }
}