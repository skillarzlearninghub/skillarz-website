// Cloudflare Pages Function — Skillarz Learning Hub contact form handler
// Runs at: https://skillarz.co.uk/api/contact
// Receives form submissions, validates them, and emails skillarzlearninghub@gmail.com via Resend

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers (in case of preview deployments)
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    // Parse the form data
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    // Honeypot check — if a bot fills the hidden field, reject silently
    if (data._gotcha) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Validate required fields
    const required = ["parent_name", "contact_email", "year_group", "subject", "gdpr_consent"];
    const missing = required.filter((field) => !data[field]);
    if (missing.length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: `Missing required fields: ${missing.join(", ")}` }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contact_email)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid email address" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Build email HTML
    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 24px;">
        <div style="background: linear-gradient(135deg, #0c7b7b, #005eb8); padding: 24px; border-radius: 12px 12px 0 0; color: white;">
          <h1 style="margin: 0; font-size: 22px;">📩 New Enquiry from Skillarz Website</h1>
          <p style="margin: 6px 0 0; opacity: 0.9; font-size: 14px;">A parent has submitted the booking form</p>
        </div>
        <div style="background: white; padding: 28px; border-radius: 0 0 12px 12px; border: 1px solid #dde6f0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7fa3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; width: 140px;">Parent / Guardian</td><td style="padding: 8px 0; color: #14213d; font-weight: 500;">${escapeHtml(data.parent_name)}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7fa3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.contact_email)}" style="color: #0c7b7b;">${escapeHtml(data.contact_email)}</a></td></tr>
            ${data.contact_phone ? `<tr><td style="padding: 8px 0; color: #6b7fa3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Phone</td><td style="padding: 8px 0;"><a href="tel:${escapeHtml(data.contact_phone)}" style="color: #0c7b7b;">${escapeHtml(data.contact_phone)}</a></td></tr>` : ""}
            <tr><td style="padding: 8px 0; color: #6b7fa3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Year Group</td><td style="padding: 8px 0; color: #14213d; font-weight: 500;">${escapeHtml(data.year_group)}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7fa3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Subject</td><td style="padding: 8px 0; color: #14213d; font-weight: 500;">${escapeHtml(data.subject)}</td></tr>
            ${data.cfe_level ? `<tr><td style="padding: 8px 0; color: #6b7fa3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Level</td><td style="padding: 8px 0; color: #14213d;">${escapeHtml(data.cfe_level)}</td></tr>` : ""}
            ${data.time_slot ? `<tr><td style="padding: 8px 0; color: #6b7fa3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Preferred Time</td><td style="padding: 8px 0; color: #14213d;">${escapeHtml(data.time_slot)}</td></tr>` : ""}
          </table>
          ${data.message ? `
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dde6f0;">
              <p style="color: #6b7fa3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; margin: 0 0 8px;">Message</p>
              <p style="color: #14213d; line-height: 1.6; margin: 0; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
            </div>
          ` : ""}
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dde6f0;">
            <p style="color: #22a663; font-size: 13px; margin: 0;">✓ GDPR consent given</p>
            <p style="color: #6b7fa3; font-size: 12px; margin: 8px 0 0;">Submitted: ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })} (UK time)</p>
          </div>
        </div>
        <p style="text-align: center; color: #6b7fa3; font-size: 11px; margin-top: 16px;">
          Reply directly to this email — your reply will go to the parent.<br>
          Submitted via <a href="https://skillarz.co.uk" style="color: #0c7b7b;">skillarz.co.uk</a>
        </p>
      </div>
    `;

    // Send via Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Skillarz Website <enquiries@skillarz.co.uk>",
        to: ["skillarzlearninghub@gmail.com"],
        reply_to: data.contact_email,
        subject: `📩 New enquiry from ${data.parent_name} — ${data.subject} (${data.year_group})`,
        html: htmlBody,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend API error:", errorText);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send email. Please try again or contact us directly." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Success
    return new Response(
      JSON.stringify({ success: true, message: "Thank you! We will respond the same day." }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Something went wrong. Please email us directly at skillarzlearninghub@gmail.com" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Escape HTML to prevent injection
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
