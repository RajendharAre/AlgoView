const nodemailer = require('nodemailer')

const isValidEmail = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP environment variables are not fully configured')
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

const sendSupportEmail = async (req, res) => {
  try {
    const { name, email, topic, subject, message, source } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' })
    }

    const safeTopic = topic || 'general'
    const safeSubject = subject || `Support request from ${name}`
    const safeSource = source || 'website'

    const transporter = createTransporter()

    const toAddress = process.env.SUPPORT_TO_EMAIL || process.env.SMTP_USER
    const fromAddress = process.env.SUPPORT_FROM_EMAIL || process.env.SMTP_USER

    const text = [
      'New support/contact request received',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Topic: ${safeTopic}`,
      `Source: ${safeSource}`,
      `Subject: ${safeSubject}`,
      '',
      'Message:',
      message,
    ].join('\n')

    await transporter.sendMail({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: `[AlgoView] ${safeSubject}`,
      text,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin-bottom: 10px;">New support/contact request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Topic:</strong> ${safeTopic}</p>
          <p><strong>Source:</strong> ${safeSource}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr style="margin: 18px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="white-space: pre-wrap;"><strong>Message:</strong><br/>${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>
      `,
    })

    return res.status(200).json({ success: true, message: 'Support request sent successfully.' })
  } catch (error) {
    console.error('Support email error:', error.message)

    if (error.message.includes('SMTP environment variables')) {
      return res.status(500).json({
        error:
          'Support email service is not configured yet. Please set SMTP variables on the server.',
      })
    }

    return res
      .status(500)
      .json({ error: 'Unable to send your request right now. Please try again shortly.' })
  }
}

module.exports = {
  sendSupportEmail,
}
