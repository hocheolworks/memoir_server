import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class MediaService {
  async uploadImage(images: Array<Express.Multer.File>, folder: string) {
    const image = images[0];
    const fileType: string = image.mimetype.slice(
      image.mimetype.indexOf('/') + 1,
    );

    const fileName = `${Math.random().toString(20).slice(2)}.${fileType}`;

    const s3: AWS.S3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_BUCKET_REGION,
    });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: String(folder + fileName),
      Body: image.buffer,
      ContentType: image.mimetype,
    };

    const uploadResult: any = await new Promise((resolve, reject) => {
      s3.upload(params, (err: { message: any }, data: unknown) => {
        if (err) {
          reject(err.message);
        }
        resolve(data);
      });
    });

    const cdnUrl = process.env.CDN_URL;

    return { cdnUrl, path: uploadResult.Key };
  }
}
