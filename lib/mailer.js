import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Auth System" <no-reply@example.com>',
    to: email,
    subject: "Your Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #555;">Hello,</p>
        <p style="font-size: 16px; color: #555;">You requested a password reset. Use the following 6-digit OTP to complete the process. This OTP is valid for 5 minutes.</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #888;">If you didn't request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; ${new Date().getFullYear()} Your Application. All rights reserved.</p>
      </div>
    `,
  };

  try {
    console.log(`[MAILER] Attempting to send email to ${email}...`);
    console.log(`[MAILER] OTP for ${email}: ${otp}`);
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("!!!! [MAILER] CRITICAL ERROR SENDING EMAIL !!!!");
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code);
    console.error("Full Error:", error);
    return false;
  }
};
