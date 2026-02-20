import functions from "firebase-functions";
import sgMail from "@sendgrid/mail";

// Set SendGrid API key from Firebase config
const sendgridKey = functions.config().sendgrid?.api_key;
if (!sendgridKey) {
  console.error("SendGrid API key not configured!");
}
sgMail.setApiKey(sendgridKey);

/**
 * Send email function
 * Endpoint: /sendEmail
 */
export const sendEmail = functions.https.onRequest(async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    // Validate required fields
    if (!to || !subject || (!text && !html)) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: to, subject, and (text or html)",
      });
      return;
    }

    const msg = {
      to: to,
      from: "hello@algovieww.me", // Your verified sender address
      subject: subject,
      text: text,
      html: html || text,
    };

    await sgMail.send(msg);

    res.status(200).json({
      success: true,
      message: "Email sent successfully!",
      to: to,
    });
  } catch (error) {
    console.error("SendGrid error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to send email",
    });
  }
});

/**
 * Welcome email function
 * Sends welcome email to new user
 */
export const sendWelcomeEmail = functions.https.onRequest(
  async (req, res) => {
    try {
      const { email, name } = req.body;

      if (!email || !name) {
        res.status(400).json({
          success: false,
          error: "Missing required fields: email, name",
        });
        return;
      }

      const msg = {
        to: email,
        from: "hello@algovieww.me",
        subject: `Welcome to AlgoView, ${name}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome to AlgoView! 🚀</h1>
            <p>Hi ${name},</p>
            <p>Thank you for joining AlgoView. We're excited to have you on board!</p>
            <p>Start exploring algorithms, DSA concepts, and interview preparation right now.</p>
            <p>
              <a href="https://algoview.me" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Go to AlgoView
              </a>
            </p>
            <p>Happy learning!</p>
            <p>
              AlgoView Team<br>
              <a href="https://algoview.me">algoview.me</a>
            </p>
          </div>
        `,
      };

      await sgMail.send(msg);

      res.status(200).json({
        success: true,
        message: "Welcome email sent successfully!",
        email: email,
      });
    } catch (error) {
      console.error("SendGrid error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to send welcome email",
      });
    }
  }
);

/**
 * Contact form email function
 * Sends notification to admin when user submits contact form
 */
export const sendContactEmail = functions.https.onRequest(
  async (req, res) => {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        res.status(400).json({
          success: false,
          error: "Missing required fields: name, email, message",
        });
        return;
      }

      // Send notification to admin
      const adminMsg = {
        to: "arerajendhar33@gmail.com", // Your admin email
        from: "noreply@algovieww.me",
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      };

      await sgMail.send(adminMsg);

      // Send confirmation to user
      const userMsg = {
        to: email,
        from: "support@algovieww.me",
        subject: "We received your message",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Thank You! 😌</h1>
            <p>Hi ${name},</p>
            <p>We received your message and will get back to you soon.</p>
            <p>Best regards,<br>AlgoView Team</p>
          </div>
        `,
      };

      await sgMail.send(userMsg);

      res.status(200).json({
        success: true,
        message: "Contact email sent successfully!",
      });
    } catch (error) {
      console.error("SendGrid error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to send contact email",
      });
    }
  }
);
