import { NextResponse } from 'next/server';
import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const BUCKET = process.env.MINIO_BUCKET;

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type');
    let buffer;
    let filename;

    // Support both JSON (base64) and FormData (blob) uploads
    if (contentType?.includes('multipart/form-data')) {
      // FormData upload
      const formData = await req.formData();
      const stripFile = formData.get('strip');
      
      if (!stripFile) {
        return NextResponse.json({ error: 'No strip file provided' }, { status: 400 });
      }
      
      buffer = Buffer.from(await stripFile.arrayBuffer());
      filename = `strip_${Date.now()}.png`;
      
      console.log('📤 Uploading photo strip from FormData:', filename);
    } else {
      // JSON base64 upload (legacy support)
      const { image } = await req.json();
      
      if (!image) {
        return NextResponse.json({ error: 'No image' }, { status: 400 });
      }
      
      // Remove base64 prefix
      const base64Data = image.replace(/^data:image\/png;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
      filename = `strip_${Date.now()}.png`;
      
      console.log('📤 Uploading photo strip from base64:', filename);
    }

    // Pastikan bucket ada
    const exists = await minioClient.bucketExists(BUCKET);
    if (!exists) {
      await minioClient.makeBucket(BUCKET);
    }

    // Upload ke MinIO
    await minioClient.putObject(BUCKET, filename, buffer, {
      'Content-Type': 'image/png',
    });

    // URL public (hanya domain MinIO + bucket + filename)
    const url = `https://${process.env.MINIO_ENDPOINT}/${BUCKET}/${filename}`;

    console.log('✅ Photo strip uploaded successfully:', url);

    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error('❌ Failed to upload photo strip:', error);
    return NextResponse.json({ 
      error: 'Failed to upload photo strip',
      details: error.message 
    }, { status: 500 });
  }
}