import { NextResponse } from 'next/server';

/**
 * API to test if a MinIO URL is accessible
 * This helps debug CORS and bucket policy issues
 */
export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log('🔍 Testing MinIO URL accessibility:', url);

    // Try to fetch the URL from server-side
    const response = await fetch(url, {
      method: 'HEAD',
    });

    console.log('   Server-side test result:', response.status, response.statusText);

    return NextResponse.json({
      success: true,
      serverSide: {
        accessible: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      },
      url: url,
    });
  } catch (error) {
    console.error('❌ Server-side URL test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      serverSide: {
        accessible: false,
        error: error.message,
      },
    }, { status: 500 });
  }
}
