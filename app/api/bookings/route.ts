import { NextRequest, NextResponse } from 'next/server';

// GET /api/bookings - List bookings (admin)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  try {
    // In production: query Supabase
    // const { data, error } = await supabaseAdmin
    //   .from('bookings')
    //   .select('*, packages(*), uploaded_assets(*), time_slots(*)')
    //   .eq(status ? 'status' : 'id', status || '%')
    //   .order('created_at', { ascending: false });

    return NextResponse.json({
      success: true,
      data: [],
      message: 'Bookings retrieved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageId, assetId, slotId, customerInfo } = body;

    if (!packageId || !assetId || !slotId || !customerInfo) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate slot availability
    // Check if slot is still available
    // Create booking record in Supabase
    // In production:
    // const { data, error } = await supabaseAdmin
    //   .from('bookings')
    //   .insert({ package_id: packageId, asset_id: assetId, slot_id: slotId, ...customerInfo, status: 'draft' })
    //   .select()
    //   .single();

    const bookingId = `BK-${Date.now()}`;

    return NextResponse.json({
      success: true,
      data: { bookingId, status: 'draft' },
      message: 'Booking created',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
