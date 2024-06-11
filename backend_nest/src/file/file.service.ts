import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

import {
  BlobSASPermissions,
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob';
//import sharp from 'sharp';
import * as sharp from 'sharp';

@Injectable()
export class FileService {
  private accountName: any;
  private accountKey: any;
  private sharedKeyCredential: StorageSharedKeyCredential;

  constructor(private configService: ConfigService) {
    this.accountName = this.configService.get('AZURE_STORAGE_ACCOUNT_NAME');
    this.accountKey = this.configService.get('AZURE_STORAGE_ACCOUNT_KEY');
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      this.accountName,
      this.accountKey,
    );
  }

  private getBlobServiceClient(url: string): BlobServiceClient {
    return new BlobServiceClient(url, this.sharedKeyCredential);
  }

  private async generateSASToken(containerName: string) {
    const blobServiceClient = this.getBlobServiceClient(
      `https://${this.accountName}.blob.core.windows.net`,
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const permissions = new BlobSASPermissions();
    permissions.write = true;
    permissions.create = true;
    permissions.read = true;

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 30);

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: containerClient.containerName,
        permissions: permissions,
        expiresOn: expiryDate,
      },
      this.sharedKeyCredential,
    ).toString();

    return sasToken;
  }

  async uploadImage(
    image: ArrayBuffer,
    containerName: string,
  ): Promise<string> {
    console.log('Uploading image to Azure Blob Storage...', image);
    const sharpImage = await sharp(image).metadata();
    console.log(sharpImage.width, sharpImage.height);

    const accountName = this.configService.get('AZURE_STORAGE_ACCOUNT_NAME');

    const sasToken = await this.generateSASToken(containerName);

    const blobServiceClient2 = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`,
    );

    const containerClient =
      blobServiceClient2.getContainerClient(containerName);

    // generate current timestamp
    const timestamp = new Date().getTime();
    const file_name = `${randomUUID()}_${timestamp}.png`;

    const blockBlobClient = containerClient.getBlockBlobClient(file_name);

    const res = await blockBlobClient.uploadData(image);

    const image_url = res._response.request.url.replace(`?${sasToken}`, '');

    console.log('File uploaded successfully!', image_url);
    return image_url;
  }
}
