import { auth } from '@/lib/auth';
import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const bucketName = process.env.MINIO_BUCKET || 'photobooth';

export async function POST(request) {
  try {
    // Check authentication - allow anonymous but use session if available
    const session = await auth();
    
    const formData = await request.formData();
    const photoFile = formData.get('photo');

    if (!photoFile) {
      return Response.json({ error: 'No photo provided' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    
    // Generate unique filename - use user ID if logged in, or temp-{timestamp} if not
    const timestamp = Date.now();
    const userId = session?.user?.id || `temp-${timestamp}`;
    const fileName = `captured-photos/${userId}/${timestamp}-${photoFile.name}`;

    // Ensure bucket exists
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
    }

    // Upload to MinIO
    await minioClient.putObject(bucketName, fileName, buffer, buffer.length, {
      'Content-Type': photoFile.type || 'image/png',
    });

    // Generate public URL based on your MinIO configuration
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const port = process.env.MINIO_PORT;
    const endpoint = process.env.MINIO_ENDPOINT;
    
    // Construct URL - if port is 443 or 80, don't include it in URL
    let photoUrl;
    if ((protocol === 'https' && port === '443') || (protocol === 'http' && port === '80')) {
      photoUrl = `${protocol}://${endpoint}/${bucketName}/${fileName}`;
    } else {
      photoUrl = `${protocol}://${endpoint}:${port}/${bucketName}/${fileName}`;
    }

    console.log('📸 Photo uploaded successfully:', photoUrl);

    // Also generate proxy URL for CORS bypass
    const proxyUrl = `/api/minio-proxy?file=${encodeURIComponent(fileName)}`;

    return Response.json({ 
      success: true, 
      url: photoUrl,
      proxyUrl: proxyUrl, // Use this if direct URL fails due to CORS
      fileName: fileName
    });

  } catch (error) {
    console.error('❌ Upload captured photo error:', error);
    return Response.json({ 
      error: 'Failed to upload photo',
      details: error.message 
    }, { status: 500 });
  }
}
