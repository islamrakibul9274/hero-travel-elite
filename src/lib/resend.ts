import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY || "");

export interface BookingConfirmationEmailParams {
  toEmail: string;
  customerName: string;
  bookingReference: string;
  destinationTitle: string;
  travelDate: string;
  guestsCount: number;
  totalPrice: number;
}

export async function sendBookingConfirmationEmail(params: BookingConfirmationEmailParams) {
  try {
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0F172A; padding: 32px 24px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">HERO TRAVEL</h1>
          <p style="color: #94A3B8; margin: 8px 0 0 0; font-size: 14px;">Luxury Expeditions & Curated Journeys</p>
        </div>
        
        <div style="padding: 32px 24px;">
          <h2 style="color: #0F172A; margin: 0 0 16px 0; font-size: 20px;">Booking Confirmed, ${params.customerName}!</h2>
          <p style="color: #475569; line-height: 1.6; margin: 0 0 24px 0;">
            Your bespoke reservation for <strong>${params.destinationTitle}</strong> has been secured. Your dedicated trip curator will contact you 7 days prior to departure with final private transfer details.
          </p>

          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #64748B; font-size: 13px; padding-bottom: 8px;">Booking Reference</td>
                <td style="color: #0F172A; font-weight: 700; font-size: 14px; text-align: right; padding-bottom: 8px;">${params.bookingReference}</td>
              </tr>
              <tr>
                <td style="color: #64748B; font-size: 13px; padding-bottom: 8px;">Departure Date</td>
                <td style="color: #0F172A; font-weight: 600; font-size: 14px; text-align: right; padding-bottom: 8px;">${params.travelDate}</td>
              </tr>
              <tr>
                <td style="color: #64748B; font-size: 13px; padding-bottom: 8px;">Travelers</td>
                <td style="color: #0F172A; font-weight: 600; font-size: 14px; text-align: right; padding-bottom: 8px;">${params.guestsCount} Guest(s)</td>
              </tr>
              <tr style="border-top: 1px dashed #CBD5E1;">
                <td style="color: #0F172A; font-size: 15px; font-weight: 700; padding-top: 12px;">Total Paid</td>
                <td style="color: #EA580C; font-size: 18px; font-weight: 700; text-align: right; padding-top: 12px;">$${params.totalPrice.toLocaleString()} USD</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="http://localhost:3000/profile" style="background-color: #EA580C; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">View Booking in Dashboard</a>
          </div>
        </div>

        <div style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px; text-align: center; font-size: 12px; color: #94A3B8;">
          © 2026 Hero Travel Luxury Expeditions. All rights reserved.
        </div>
      </div>
    `;

    // Resend sandbox only allows sending to verified domain or onboarding email if domain is not configured
    const result = await resend.emails.send({
      from: "Hero Travel <onboarding@resend.dev>",
      to: params.toEmail,
      subject: `Booking Confirmed: ${params.destinationTitle} (${params.bookingReference})`,
      html: htmlContent,
    });

    return { success: true, result };
  } catch (error: any) {
    console.warn("Resend email dispatch notice (sandbox constraint or invalid recipient):", error?.message);
    return { success: false, error: error?.message };
  }
}
