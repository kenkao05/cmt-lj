import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function GET(req: NextRequest, { params }: { params: { conferenceId: string } }) {
  const supabase = createServiceClient();

  const { data: conference } = await supabase
    .from('conferences')
    .select('*')
    .eq('id', params.conferenceId)
    .single();

  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('conference_id', params.conferenceId);

  if (!conference) {
    return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
  }

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([595, 842]); // A4
  let y = 800;

  const drawText = (text: string, size = 11, bold = false, color = rgb(0, 0, 0)) => {
    if (y < 60) {
      page = pdfDoc.addPage([595, 842]);
      y = 800;
    }
    page.drawText(text, { x: 50, y, size, font: bold ? boldFont : font, color });
    y -= size + 8;
  };

  drawText(`Conference Report: ${conference.title}`, 18, true, rgb(0.6, 0.4, 0.1));
  drawText(`Department: ${conference.department}`);
  drawText(`Status: ${conference.status}`);
  drawText(`Start Date: ${conference.start_date || 'N/A'}`);
  drawText(`Submission Deadline: ${conference.submission_deadline || 'N/A'}`);
  drawText(`Registration Fee: ${conference.registration_fee || 'N/A'}`);
  drawText(`Payment Link: ${conference.payment_link_url ? conference.payment_link_url : 'Not set'}`);
  y -= 10;
  drawText(`Total Submissions: ${submissions?.length || 0}`, 13, true);
  y -= 10;

  submissions?.forEach((s: any, i: number) => {
    drawText(`${i + 1}. ${s.paper_title} (${s.type})`, 12, true);
    drawText(`   Abstract ID: ${s.abstract_id}`);
    drawText(`   Author: ${s.author_name} (${s.author_email})`);
    drawText(`   Status: ${s.status}`);
    y -= 6;
  });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${conference.title.replace(/\s+/g, '_')}_report.pdf"`
    }
  });
}