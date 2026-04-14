export async function onRequestPost(context) {
  const RESEND_API_KEY = context.env.RESEND_API_KEY;
  const RECIPIENT_EMAIL = context.env.RECIPIENT_EMAIL || 'Info@NewflowPartners.com';

  try {
    const { name, email, company, message } = await context.request.json();

    // Validate
    if (!name?.trim()) return Response.json({ error: 'Name is required.' }, { status: 400 });
    if (!email?.trim()) return Response.json({ error: 'Email is required.' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return Response.json({ error: 'Please enter a valid email.' }, { status: 400 });
    }

    const htmlBody = `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${name.trim()}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="mailto:${email.trim()}">${email.trim()}</a></td></tr>
        ${company?.trim() ? `<tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Company</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${company.trim()}</td></tr>` : ''}
        <tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px 12px;white-space:pre-wrap;">${(message?.trim() || '(No message provided)').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td></tr>
      </table>
    `;

    const textBody = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      company?.trim() ? `Company: ${company.trim()}` : null,
      '',
      'Message:',
      message?.trim() || '(No message provided)',
    ].filter(Boolean).join('\n');

    const resResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Newflow Partners <noreply@newflow.partners>',
        to: [RECIPIENT_EMAIL],
        reply_to: email.trim(),
        subject: `New Contact: ${name.trim()}${company?.trim() ? ` — ${company.trim()}` : ''}`,
        html: htmlBody,
        text: textBody,
      }),
    });

    if (!resResponse.ok) {
      const errText = await resResponse.text();
      console.error('Resend error:', errText);
      return Response.json({ error: 'Failed to send message. Please try again or email us directly.' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return Response.json({ error: 'Failed to send message. Please try again or email us directly.' }, { status: 500 });
  }
}
