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

export async function DELETE(request) {
  try {
    // Check authentication - allow anonymous but with restrictions
    const session = await auth();
    
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return Response.json({ error: 'No fileName provided' }, { status: 400 });
    }

    // Security check: 
    // - Logged in users can only delete their own photos
    // - Anonymous users can only delete temp photos
    if (session?.user) {
      const userId = session.user.id;
      if (!fileName.startsWith(`captured-photos/${userId}/`)) {
        return Response.json({ error: 'Unauthorized to delete this photo' }, { status: 403 });
      }
    } else {
      // Anonymous user - can only delete temp photos
      if (!fileName.includes('/temp-')) {
        return Response.json({ error: 'Unauthorized to delete this photo' }, { status: 403 });
      }
    }

    // Delete from MinIO
    await minioClient.removeObject(bucketName, fileName);

    return Response.json({ 
      success: true, 
      message: 'Photo deleted successfully'
    });

  } catch (error) {
    console.error('Delete photo error:', error);
    return Response.json({ 
      error: 'Failed to delete photo',
      details: error.message 
    }, { status: 500 });
  }
}
