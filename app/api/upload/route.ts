import { NextRequest, NextResponse } from 'next/server';

const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'video/mp4', 'video/quicktime', 'video/webm',
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bookingId = formData.get('bookingId') as string;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Format non supporté: ${file.type}` },
        { status: 400 }
      );
    }

    // Validate size
    const maxSize = file.type.startsWith('video') ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `Fichier trop volumineux. Max: ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // In production: Upload to Supabase Storage
    // const fileBuffer = await file.arrayBuffer();
    // const fileName = `${bookingId}/${Date.now()}-${file.name}`;
    // const { url, error } = await uploadFile(BUCKETS.ASSETS, fileName, file, file.type);
    // if (error) throw new Error(error);

    // Save asset record to database
    // const { data: asset } = await supabaseAdmin.from('uploaded_assets').insert({
    //   booking_id: bookingId,
    //   type: file.type.startsWith('video') ? 'video' : 'image',
    //   url,
    //   filename: file.name,
    //   file_size: file.size,
    //   mime_type: file.type,
    // }).select().single();

    const assetId = `asset_${Date.now()}`;

    return NextResponse.json({
      success: true,
      data: {
        assetId,
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
        type: file.type.startsWith('video') ? 'video' : 'image',
        // url: url,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
