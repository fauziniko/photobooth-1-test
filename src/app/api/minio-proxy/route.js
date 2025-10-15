import { Client } from 'minio';
import { NextResponse } from 'next/server';

/**
 * Proxy API to serve MinIO images and bypass CORS
 * Usage: /api/minio-proxy?file=captured-photos/temp-123/photo.png
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');

    if (!fileName) {
      return NextResponse.json({ error: 'file parameter required' }, { status: 400 });
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

    // Get object from MinIO
    const dataStream = await minioClient.getObject(bucketName, fileName);

    // Collect chunks
    const chunks = [];
    for await (const chunk of dataStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Determine content type
    let contentType = 'image/png';
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    } else if (fileName.endsWith('.gif')) {
      contentType = 'image/gif';
    }

    // Return image with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('❌ MinIO proxy error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch image from MinIO', details: error.message },
      { status: 500 }
    );
  }
}
