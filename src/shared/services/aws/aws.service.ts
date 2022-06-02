import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";

@Injectable()
export class AwsService {
  S3: AWS.S3;
  constructor(private configService: ConfigService) {
    this.S3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('accessKeyId'),
      secretAccessKey: this.configService.get<string>('secretAccessKey'),
      region: this.configService.get<string>('region'),
    });
  }

  uploadFile(file: Buffer, name: string, config = {}) {
    // Setting up S3 upload parameters
    const params = {
      Bucket: process.env.Bucket,
      Key: name,
      Body: file,
    };

    // Uploading files to the bucket
    return this.S3.upload({ ...params, ...config }).promise();
  }

  /**
   * Use it to get a signed url for file access.
   * @param key The path of the existing file to get a pre signed url.
   * @param expires The expiry time of the file url in seconds (Default is 10 minutes).
   * @returns File url
   */
  getPresignedUrl(key: string, expires = 60 * 10): string {
    const s3Params = {
      Bucket: process.env.Bucket,
      Expires: expires,
      Key: key
    };

    return this.S3.getSignedUrl('getObject', s3Params);
  }

  /**
   * 
   * @param key The path of the file to be uploaded.
   * @param contentType A standard MIME type describing the format of the object data.
   * @param acl The permission to object which can be private | public-read | public-read-write | authenticated-read
   * @param expires The expiry time of the file url in seconds (Default is 10 minutes).
   * @param params Other parameters to pass to S3 getSignedUrl.
   * @returns File url
   */
  getPreSignedUrl(key: string, contentType: string, acl = 'public-read', expires = 60 * 10, params = {}): string {
    const s3Params = {
      Bucket: process.env.Bucket,
      Expires: expires,
      ACL: acl,
      Key: key,
      ContentType: contentType,
    };

    return this.S3.getSignedUrl('putObject', { ...s3Params, ...params });
  }

  /**
   * Delete an object from the S3 bucket.
   * @param key The path of object to delete.
   * @returns 
   */
  deleteObject(key: string) {
    const s3Params = {
      Bucket: process.env.Bucket,
      Key: key
    };

    return this.S3.deleteObject(s3Params);
  }

  /**
   * Delete objects from the S3 bucket.
   * @param keys Array of string keys to delete
   * @returns 
   */
  deleteObjects(keys: string[]) {
    const objects = keys.map(key => {
      return {
        Key: key
      }
    })

    const s3Params = {
      Bucket: process.env.Bucket,
      Delete: {
        Objects: objects,
        Quiet: false
      }
    };

    return this.S3.deleteObjects(s3Params);
  }
}
