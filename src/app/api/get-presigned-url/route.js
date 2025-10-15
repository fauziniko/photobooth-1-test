import { Client } from 'minio';
import { NextResponse } from 'next/server';

/**
 * Generate presigned URL for private MinIO objects
 * This allows browser to access images even if bucket is private
 */
export async function POST(request) {
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
    }

    // Initialize MinIO client
    const minioClient = new Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT || '443'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });

    const bucketName = process.env.MINIO_BUCKET;

    console.log('🔐 Generating presigned URL for:', fileName);

    // Generate presigned URL (valid for 24 hours)
    const presignedUrl = await minioClient.presignedGetObject(
      bucketName,
      fileName,
      24 * 60 * 60 // 24 hours
    );

    console.log('✅ Presigned URL generated:', presignedUrl);

    return NextResponse.json({
      success: true,
      presignedUrl: presignedUrl,
      expiresIn: '24 hours',
    });
  } catch (error) {
    console.error('❌ Failed to generate presigned URL:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
