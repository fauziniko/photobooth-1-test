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

const RETRIABLE_CODES = new Set(['ECONNRESET', 'ETIMEDOUT', 'EPIPE', 'ECONNABORTED']);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function putObjectWithRetry(bucket, filename, buffer, meta, maxAttempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await minioClient.putObject(bucket, filename, buffer, meta);
      return;
    } catch (error) {
      lastError = error;
      const code = error?.code;
      const canRetry = RETRIABLE_CODES.has(code) && attempt < maxAttempts;

      if (!canRetry) {
        throw error;
      }

      console.warn(`⚠️ MinIO upload retry ${attempt}/${maxAttempts} for ${filename}: ${code}`);
      await delay(250 * attempt);
    }
  }

  throw lastError;
}

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type');
    let buffer;
    let filename;
    let objectContentType = 'image/png';

    // Support both JSON (base64) and FormData (blob) uploads
    if (contentType?.includes('multipart/form-data')) {
      // FormData upload
      const formData = await req.formData();
      const kindRaw = String(formData.get('kind') || 'strip').toLowerCase();
      const kind = ['strip', 'gif', 'live', 'frame'].includes(kindRaw) ? kindRaw : 'strip';
      const mediaFile = formData.get('strip') || formData.get('media');
      
      if (!mediaFile) {
        return NextResponse.json({ error: 'No media file provided' }, { status: 400 });
      }

      const detectedType = typeof mediaFile.type === 'string' ? mediaFile.type : '';
      let extension = '.png';
      if (kind === 'gif') {
        extension = '.gif';
      } else if (kind === 'live') {
        if (detectedType.includes('mp4')) {
          extension = '.mp4';
        } else if (detectedType.includes('quicktime')) {
          extension = '.mov';
        } else {
          extension = '.webm';
        }
      } else if (detectedType.includes('jpeg')) {
        extension = '.jpg';
      }

      if (detectedType) {
        objectContentType = detectedType;
      } else if (kind === 'gif') {
        objectContentType = 'image/gif';
      } else if (kind === 'live') {
        objectContentType = detectedType || 'video/webm';
      } else if (kind === 'frame') {
        objectContentType = 'image/png';
      }
      
      buffer = Buffer.from(await mediaFile.arrayBuffer());
      filename = `${kind}_${Date.now()}${extension}`;
      
      console.log(`📤 Uploading media from FormData (${kind}):`, filename);
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

    // Upload ke MinIO with retry for transient network resets
    await putObjectWithRetry(BUCKET, filename, buffer, {
      'Content-Type': objectContentType,
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