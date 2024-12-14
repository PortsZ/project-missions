import { prisma } from '@/src/lib/prisma';
import { json } from 'stream/consumers';

var SDK = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (!req.headers.get('Content-Type')?.includes('multipart/form-data')) {
    return new Response(`Request must be of type multipart/form-data`, {
      status: 400,
    });
  }

  const data = await req.formData();

  const file1 = data.get('image1') as Blob;
  const name1 = data.get('imageLabel1') as string;
  const file2 = data.get('image2') as Blob;
  const name2 = data.get('imageLabel2') as string;
  let user;

  if (!file1 && !file2) {
    return new Response(`No file uploaded`, { status: 400 });
  }

  try {
    user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      include: {
        company: {
          include: {
            branding: true,
          },
        },
      },
    });

    if (!user?.company?.branding) {
      return new Response('branding not found', { status: 404 });
    }
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }

  const client_s3 = new SDK.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
  });

  try {
    const brandingId = user.company.branding.id;

    if (file1) {
      const buffer1 = Buffer.from(await file1.arrayBuffer());
      const fileName1 = `portifolio_1_${Date.now()}`;
      const contentType1 = file1.type;

      const fileParams1 = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName1,
        Body: buffer1,
        ContentType: contentType1,
      };

      const data = await client_s3.upload(fileParams1).promise();
      try {
        await prisma.branding.update({
          where: {
            id: brandingId,
          },
          data: {
            image1: data.Location,
            imageLabel1: name1,
          },
        });
      } catch (error: any) {
        return new Response(error.message, { status: 500 });
      }
    }

    if (file2) {
      const buffer2 = Buffer.from(await file2.arrayBuffer());
      const fileName2 = `portifolio_2_${Date.now()}`;
      const contentType2 = file2.type;

      const fileParams2 = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName2,
        Body: buffer2,
        ContentType: contentType2,
      };

      const data = await client_s3.upload(fileParams2).promise();
      try {
        await prisma.branding.update({
          where: {
            id: brandingId,
          },
          data: {
            image2: data.Location,
            imageLabel2: name2,
          },
        });
      } catch (error: any) {
        return new Response(error.message, { status: 500 });
      }
    }

    return new Response(`File uploaded successfully`, { status: 200 });
  } catch (e: any) {
    return new Response(`An error occurred: ${e.message}`, { status: 500 });
  }
}
