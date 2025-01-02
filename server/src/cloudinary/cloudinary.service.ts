import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
    uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
          if (!file) {
            return reject(new Error('No file uploaded.'));
          }
      
          console.log('File received:', file); 
      
          const uploadStream = cloudinary.uploader.upload_stream(
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );
      
          if (!file.buffer) {
            return reject(new Error('File buffer is missing.'));
          }
      
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      }
      
    uploadVideo(file: Express.Multer.File): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'video' },
            (error, result) => {
            if (error) return reject(error);
            resolve(result);
            },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
    deleteFile(publicId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error) => {
            if (error) return reject(error);
            resolve();
        });
        });
    }
}
