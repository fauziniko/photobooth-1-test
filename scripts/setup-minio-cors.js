/**
 * Script to configure CORS for MinIO bucket
 * This allows browser to load images from MinIO
 * Note: MinIO JS SDK doesn't support CORS directly, use alternative methods below
 */

async function setupMinioCORS() {
  console.log('🚀 Setting up MinIO CORS configuration...\n');

  const endpoint = process.env.MINIO_ENDPOINT;
  const bucketName = process.env.MINIO_BUCKET || 'photobooth';

  console.log('📋 Configuration:');
  console.log('   Endpoint:', endpoint);
  console.log('   Bucket:', bucketName);
  console.log('');

  try {
    // CORS Configuration
    const corsConfig = `<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>`;

    console.log('📝 CORS Configuration to be applied:');
    console.log(corsConfig);
    console.log('');

    // Note: MinIO JS SDK doesn't have direct CORS methods
    // We need to use mc (MinIO Client CLI) or AWS SDK
    console.log('⚠️  MinIO JS SDK does not support CORS configuration directly.');
    console.log('');
    console.log('📋 To enable CORS, use one of these methods:');
    console.log('');
    console.log('METHOD 1: Using MinIO Client (mc) CLI');
    console.log('─────────────────────────────────────');
    console.log('1. Install mc: brew install minio/stable/mc');
    console.log('2. Add alias:');
    console.log(`   mc alias set myminio https://${endpoint} YOUR_ACCESS_KEY YOUR_SECRET_KEY`);
    console.log('3. Set CORS:');
    console.log(`   mc anonymous set-json cors.json myminio/${bucketName}`);
    console.log('');
    console.log('Where cors.json contains:');
    console.log(JSON.stringify({
      CORSRules: [
        {
          AllowedOrigins: ['*'],
          AllowedMethods: ['GET', 'HEAD'],
          AllowedHeaders: ['*'],
          MaxAgeSeconds: 3000,
        },
      ],
    }, null, 2));
    console.log('');

    console.log('METHOD 2: Using MinIO Console Web UI');
    console.log('─────────────────────────────────────');
    console.log(`1. Open: https://${endpoint}`);
    console.log(`2. Login with credentials`);
    console.log(`3. Go to Buckets → ${bucketName} → Settings → CORS`);
    console.log(`4. Add CORS rule allowing * origin with GET/HEAD methods`);
    console.log('');

    console.log('METHOD 3: Using AWS CLI (S3 compatible)');
    console.log('─────────────────────────────────────');
    console.log('1. Install AWS CLI: brew install awscli');
    console.log('2. Configure:');
    console.log(`   aws configure --profile minio`);
    console.log('3. Set CORS:');
    console.log(`   aws s3api put-bucket-cors --bucket ${bucketName} --cors-configuration file://cors.json --endpoint-url https://${endpoint} --profile minio`);
    console.log('');

    console.log('✅ After setting CORS, restart your Next.js app and test again!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupMinioCORS().catch(console.error);
