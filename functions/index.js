import functions from "firebase-functions";
import sgMail from "@sendgrid/mail";

// Set CORS headers on every response
function setCors(res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
}

// Initialize SendGrid later, not at module load time
let sendgridKey = null;

function ensureSendgridConfigured() {
  if (!sendgridKey) {
    sendgridKey = functions.config().sendgrid?.api_key;
    if (!sendgridKey) {
      console.error("SendGrid API key not configured!");
      throw new Error("SendGrid API key not configured");
    }
    sgMail.setApiKey(sendgridKey);
  }
}

/**
 * Send email function
 * Endpoint: /sendEmail
 */
export const sendEmail = functions.https.onRequest(async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") { res.status(204).send(""); return; }
  try {
    ensureSendgridConfigured();
    const { to, subject, text, html } = req.body;

    if (!to || !subject || (!text && !html)) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: to, subject, and (text or html)",
      });
      return;
    }

    const msg = {
      to: to,
      from: "hello@algovieww.me",
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
export const sendWelcomeEmail = functions.https.onRequest(async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") { res.status(204).send(""); return; }
  try {
    ensureSendgridConfigured();
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
});

/**
 * Contact form email function
 * Sends notification to admin when user submits contact form
 */
export const sendContactEmail = functions.https.onRequest(async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") { res.status(204).send(""); return; }
  try {
    ensureSendgridConfigured();
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
});

/**
 * Send verification code email function
 * Sends 6-digit verification code to user during signup
 */
export const sendVerificationEmail = functions.https.onRequest(async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") { res.status(204).send(""); return; }
  try {
    ensureSendgridConfigured();
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: email, verificationCode",
      });
      return;
    }

      const msg = {
        to: email,
        from: "hello@algovieww.me",
        subject: "Verify Your AlgoView Account 🚀",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1f2937; font-size: 28px; margin: 0;">Welcome to AlgoView! 🎓</h1>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="color: #4b5563; font-size: 16px; margin-bottom: 20px;">Hi there,</p>
              
              <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">Thank you for signing up for AlgoView! To complete your registration and secure your account, please verify your email using the code below.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px; display: inline-block;">
                  <p style="font-size: 12px; color: rgba(255,255,255,0.8); margin: 0; text-transform: uppercase; letter-spacing: 2px;">Your Verification Code</p>
                  <p style="font-size: 48px; font-weight: bold; color: white; margin: 20px 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${verificationCode}</p>
                </div>
              </div>
              
              <p style="color: #75838d; font-size: 14px; text-align: center; margin: 30px 0;">This code will expire in <strong>10 minutes</strong></p>
              
              <div style="background-color: #f0f4ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #4b5563; font-size: 13px; margin: 0;"><strong>✓ Security tip:</strong> Never share this code with anyone. AlgoView support will never ask you for this code.</p>
              </div>
              
              <p style="color: #4b5563; font-size: 14px; margin-top: 20px;">Once verified, you'll have access to:</p>
              <ul style="color: #4b5563; font-size: 14px; margin: 10px 0; padding-left: 20px;">
                <li>Interactive Algorithm Visualizations</li>
                <li>DSA Interview Preparation</li>
                <li>Code Examples & Explanations</li>
                <li>Progress Tracking</li>
              </ul>
              
              <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 30px; text-align: center;">
                <p style="color: #75838d; font-size: 12px; margin: 0;">If you didn't sign up for AlgoView, you can safely ignore this email.</p>
                <p style="color: #75838d; font-size: 12px; margin: 10px 0;">Questions? Contact us at support@algovieww.me</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #75838d; font-size: 12px; margin: 0;">© 2026 AlgoView. All rights reserved.</p>
              <p style="color: #75838d; font-size: 12px; margin: 5px 0;">Made with ❤️ for learners</p>
            </div>
          </div>
        `,
      };

      await sgMail.send(msg);

      res.status(200).json({
        success: true,
        message: "Verification email sent successfully!",
        email: email,
      });
    } catch (error) {
      console.error("SendGrid error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to send verification email",
      });
    }
});
