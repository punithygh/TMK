import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { folder } = await request.json();
    
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
      return NextResponse.json({ error: 'Cloudinary credentials missing' }, { status: 500 });
    }

    // Prepare parameters for signature
    // Sort parameters alphabetically as required by Cloudinary
    const params: Record<string, any> = {
      timestamp,
      folder: folder || 'tumkurconnect_uploads'
    };

    const sortedKeys = Object.keys(params).sort();
    const signatureString = sortedKeys.map(key => `${key}=${params[key]}`).join('&') + apiSecret;
    
    // Generate SHA-1 signature
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder: params.folder
    });
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
