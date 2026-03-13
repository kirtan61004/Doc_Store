const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (not your Gmail password)
  },
});

/**
 * Send an OTP email to the admin.
 * @param {string} toEmail - recipient email
 * @param {string} otp     - 6-digit OTP string
 */
const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"DocStore Admin" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your DocStore Admin Login OTP",
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1e3a8a, #1e40af); padding: 32px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: 0.5px;">DocStore</h1>
          <p style="color: #bfdbfe; margin: 6px 0 0; font-size: 14px;">Admin Portal</p>
        </div>
        <div style="padding: 36px 32px; background: #fff;">
          <h2 style="color: #1e293b; font-size: 20px; margin: 0 0 12px;">Admin Login OTP</h2>
          <p style="color: #64748b; font-size: 15px; margin: 0 0 28px; line-height: 1.6;">
            Use the code below to complete your admin login. This OTP expires in <strong>5 minutes</strong>.
          </p>
          <div style="background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 10px; padding: 24px; text-align: center; margin-bottom: 28px;">
            <span style="font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #1e40af; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 13px; margin: 0;">
            If you didn't request this OTP, please secure your account immediately.
          </p>
        </div>
        <div style="padding: 16px 32px; background: #f1f5f9; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} DocStore. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
