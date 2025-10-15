import { Client } from 'minio';

/**
 * Script to configure MinIO bucket for public access
 * Run this once: node scripts/setup-minio-bucket.js
 */

async function setupMinioBucket() {
  console.log('🚀 Setting up MinIO bucket configuration...\n');

  // Load environment variables
  const endpoint = process.env.MINIO_ENDPOINT;
  const port = parseInt(process.env.MINIO_PORT || '443');
  const useSSL = process.env.MINIO_USE_SSL === 'true';
  const accessKey = process.env.MINIO_ACCESS_KEY;
  const secretKey = process.env.MINIO_SECRET_KEY;
  const bucketName = process.env.MINIO_BUCKET || 'photobooth';

  console.log('📋 Configuration:');
  console.log('   Endpoint:', endpoint);
  console.log('   Port:', port);
  console.log('   SSL:', useSSL);
  console.log('   Bucket:', bucketName);
  console.log('');

  // Initialize MinIO client
  const minioClient = new Client({
    endPoint: endpoint,
    port: port,
    useSSL: useSSL,
    accessKey: accessKey,
    secretKey: secretKey,
  });

  try {
    // 1. Check if bucket exists
    console.log('1️⃣ Checking if bucket exists...');
    const bucketExists = await minioClient.bucketExists(bucketName);
    
    if (!bucketExists) {
      console.log('   ❌ Bucket does not exist. Creating...');
      await minioClient.makeBucket(bucketName, 'jakarta');
      console.log('   ✅ Bucket created successfully!');
    } else {
      console.log('   ✅ Bucket already exists');
    }
    console.log('');

    // 2. Set bucket policy for public read access
    console.log('2️⃣ Setting bucket policy for public read access...');
    
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
    console.log('   ✅ Bucket policy set successfully!');
    console.log('   📄 Policy:', JSON.stringify(policy, null, 2));
    console.log('');

    // 3. Verify policy
    console.log('3️⃣ Verifying bucket policy...');
    await minioClient.getBucketPolicy(bucketName);
    console.log('   ✅ Current policy verified');
    console.log('');

    // 4. Test upload and access
    console.log('4️⃣ Testing upload and public access...');
    const testFileName = 'test-' + Date.now() + '.txt';
    const testContent = 'This is a test file for MinIO setup verification';
    
    await minioClient.putObject(
      bucketName,
      testFileName,
      Buffer.from(testContent),
      testContent.length,
      { 'Content-Type': 'text/plain' }
    );
    console.log('   ✅ Test file uploaded:', testFileName);

    // Generate public URL
    const protocol = useSSL ? 'https' : 'http';
    let publicUrl;
    if ((protocol === 'https' && port === 443) || (protocol === 'http' && port === 80)) {
      publicUrl = `${protocol}://${endpoint}/${bucketName}/${testFileName}`;
    } else {
      publicUrl = `${protocol}://${endpoint}:${port}/${bucketName}/${testFileName}`;
    }
    
    console.log('   🔗 Public URL:', publicUrl);
    console.log('   💡 Try opening this URL in your browser to verify public access');
    console.log('');

    // 5. Clean up test file
    console.log('5️⃣ Cleaning up test file...');
    await minioClient.removeObject(bucketName, testFileName);
    console.log('   ✅ Test file removed');
    console.log('');

    console.log('✅ MinIO bucket setup completed successfully!');
    console.log('');
    console.log('📝 Summary:');
    console.log('   • Bucket is public-read enabled');
    console.log('   • All objects in the bucket are publicly accessible');
    console.log('   • Images uploaded will be visible in browser');
    console.log('');
    console.log('⚠️  Note: If images still appear black, check:');
    console.log('   1. Browser console for CORS errors');
    console.log('   2. SSL certificate validity');
    console.log('   3. Firewall/network blocking MinIO endpoint');

  } catch (error) {
    console.error('❌ Error setting up MinIO bucket:');
    console.error('   Error:', error.message);
    console.error('');
    console.error('🔍 Troubleshooting:');
    console.error('   1. Verify MinIO credentials in .env are correct');
    console.error('   2. Check network connectivity to MinIO endpoint');
    console.error('   3. Ensure MinIO server is running');
    console.error('   4. Verify you have admin permissions on MinIO');
    process.exit(1);
  }
}

// Run the setup
setupMinioBucket().catch(console.error);
