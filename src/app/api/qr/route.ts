import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      text,
      size = 300,
      format = "png",
      color = { dark: "#000000", light: "#ffffff" },
    } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Text is required to generate QR code" },
        { status: 400 }
      );
    }

    // Validate size (max 1000px to prevent abuse)
    const validSize = Math.min(Math.max(size, 100), 1000);

    // Generate QR code on the server
    const qrOptions = {
      width: validSize,
      margin: 2,
      color: {
        dark: color.dark,
        light: color.light,
      },
    };

    // Generate QR code as data URL
    const dataUrl = await QRCode.toDataURL(text, qrOptions);

    // Extract base64 data
    const base64Data = dataUrl.split(",")[1];

    return NextResponse.json({
      success: true,
      text,
      format,
      size: validSize,
      dataUrl,
      base64: base64Data,
      downloadUrl: `/api/qr/download?data=${encodeURIComponent(base64Data)}&format=${format}&text=${encodeURIComponent(text.substring(0, 20))}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("QR Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}

// GET endpoint for batch generation or validation
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get("text");

  if (!text) {
    return NextResponse.json(
      { error: "Text parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Generate a small QR for validation/preview
    const dataUrl = await QRCode.toDataURL(text, {
      width: 150,
      margin: 1,
      type: "image/png",
    });

    return NextResponse.json({
      success: true,
      text,
      preview: dataUrl,
      length: text.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("QR Preview Error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR preview" },
      { status: 500 }
    );
  }
}
