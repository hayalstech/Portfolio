import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

interface QRCodeOptions {
  text: string;
  size?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export async function POST(request: NextRequest) {
  try {
    const options: QRCodeOptions = await request.json();
    
    if (!options.text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Default options
    const qrOptions = {
      width: options.size || 300,
      margin: 2,
      color: {
        dark: options.darkColor || '#000000',
        light: options.lightColor || '#FFFFFF',
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    };

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(options.text, qrOptions);
    
    // Generate QR code as buffer for download
    const qrCodeBuffer = await QRCode.toBuffer(options.text, {
      ...qrOptions,
      type: 'png',
    });

    return NextResponse.json({
      success: true,
      dataURL: qrCodeDataURL,
      buffer: qrCodeBuffer.toString('base64'),
      options: {
        size: qrOptions.width,
        darkColor: qrOptions.color.dark,
        lightColor: qrOptions.color.light,
        errorCorrectionLevel: qrOptions.errorCorrectionLevel,
      },
    });
  } catch (error) {
    console.error('QR Code generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text') || 'https://example.com';
  const size = parseInt(searchParams.get('size') || '300');
  const format = searchParams.get('format') || 'png';

  try {
    const options = {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M' as const,
    };

    if (format === 'svg') {
      const svg = await QRCode.toString(text, { ...options, type: 'svg' });
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } else {
      const buffer = await QRCode.toBuffer(text, options);
      return new Response(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
