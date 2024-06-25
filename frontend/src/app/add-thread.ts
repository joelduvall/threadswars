'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import path from "path";
import sharp from 'sharp';
import { IMedia } from "@/models/Thread";
import { randomUUID } from 'crypto';

import {
  BlobSASPermissions,
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob';

const schema = z.object({
  content: z.string().optional(), //min(1, "There must be some content"),
  userId: z.string().optional(),
  images: z.array(z.string()).optional(),
  parentThreadId: z.string().optional(),
}).refine(data => (data.content || (data.images && data.images.length > 0), { 'message': "Either content must have a value or there must be 1 or more images"} ));

function getSharedKeyCredential() {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
  return new StorageSharedKeyCredential(
      accountName || '',
      accountKey || '',
  );
}

function getBlobServiceClient(url: string, sharedKeyCredential: StorageSharedKeyCredential): BlobServiceClient {
  return new BlobServiceClient(url, sharedKeyCredential);
}

async function generateSASToken(containerName: string) {

  const sharedKeyCredential = getSharedKeyCredential();

  const blobServiceClient = getBlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    sharedKeyCredential
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
    sharedKeyCredential,
  ).toString();

  return sasToken;
}

async function uploadImage(
  image: ArrayBuffer,
  azureStorageAccountName: string,
  containerName: string,
  azureStorageAccountKey: string
): Promise<string> {
  console.log('Uploading image to Azure Blob Storage...', image);
  const sharpImage = await sharp(image).metadata();
  console.log(sharpImage.width, sharpImage.height);

  const sasToken = await generateSASToken(containerName);

  const blobServiceClient2 = new BlobServiceClient(
    `https://${azureStorageAccountName}.blob.core.windows.net?${sasToken}`,
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

export default async function addThread(_prevState: any, params: FormData) {

  const { userId, sessionClaims } = auth();
  
  const validation = schema.safeParse({
    content: params.get("content"),
    parentThreadId: params.get("parentThreadId") === "" ? undefined : params.get("parentThreadId"),
  });

  if (validation.success) {

    const files = params.getAll("images") as File[];
    const mediaList: IMedia[] = [];

    for (const file of files) {
      if (file.size > 0) {
        const imageBuffer = await file.arrayBuffer();
        const sharpImage = await sharp(imageBuffer).metadata();

        const upload = await uploadImage(
          imageBuffer,
          process.env.AZURE_STORAGE_ACCOUNT_NAME || '',
          process.env.AZURE_STORAGE_THREAD_CONTAINER_NAME  || '',
          process.env.AZURE_STORAGE_ACCOUNT_KEY  || ''
        );

        const media: IMedia = {
          url: upload,
          type: file.type,
          height: sharpImage.height || 0,
          width: sharpImage.width || 0,
        };

        mediaList.push(media);
    }
  }


    const url = process.env.THREAD_WARS_BACKEND_URL

    if (!url) {
      return { error: "Backend URL is not defined" }
    }

    const headers =  {
        "Content-Type": "application/json",
      "Authorization": `Bearer ${cookies().get("__session")?.value}`
    };

    const postData = { ...validation.data, media: mediaList };


    const response =  await fetch(path.join(url, "/threads"), {
      method: "POST",
      headers: headers,
      body: JSON.stringify(postData),
    });
  
    if (!response.ok) { 
      console.log(response.statusText);
      throw new Error("Failed to Add thread");
    }
    // save the data, send an email, etc.
    //redirect("/");
    revalidatePath("/");
  } else {
    return {
      errors: validation.error.issues,
    };
  }
}


// @UploadedFiles() files: Express.Multer.File[],
// @Param('id') id: string,
// ) {
// const mediaList: IThreadMedia[] = [];

// //for each uploaded file, upload the file to the file service but first get the height and width of the image to store in the database
// for (const file of files) {
//   const sharpImage = await sharp(file.buffer).metadata();
//   const upload = await this.fileService.uploadImage(
//     file.buffer,
//     this.configService.get('AZURE_STORAGE_THREAD_CONTAINER_NAME'),
//   );

//   const media: IThreadMedia = {
//     url: upload,
//     type: file.mimetype,
//     height: sharpImage.height,
//     width: sharpImage.width,
//   };
//   mediaList.push(media);
// }

// await this.threadService.addThreadMedia(id, mediaList);

// return 'Media Uploaded';
// }