import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: Promise<{ id: string }>;
}

// PATCH /api/admin/bookings/[id] - Update booking status (admin action)
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, note, adminId } = body;

    if (!['approve', 'reject', 'request_revision', 'mark_displayed', 'reschedule'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    const STATUS_MAP: Record<string, string> = {
      approve: 'approved',
      reject: 'rejected',
      request_revision: 'revision_requested',
      mark_displayed: 'displayed',
    };

    const newStatus = STATUS_MAP[action];

    // In production:
    // await supabaseAdmin.from('bookings').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
    // if (note) {
    //   await supabaseAdmin.from('review_notes').insert({ booking_id: id, admin_id: adminId, note, type: action === 'request_revision' ? 'customer_facing' : 'internal' });
    // }
    // Send notification email to customer
    // if (action === 'approve') await sendApprovalEmail(booking);
    // if (action === 'reject') await sendRejectionEmail(booking);
    // if (action === 'request_revision') await sendRevisionEmail(booking, note);

    return NextResponse.json({
      success: true,
      data: { bookingId: id, status: newStatus },
      message: `Booking ${action}d successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
