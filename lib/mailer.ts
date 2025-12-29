import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpMail(to: string, otp: string) {
  await transporter.sendMail({
    from: `"EcoWatch Security" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your OTP Code (Valid for 30 seconds)",
    html: `
      <div style="font-family:Arial">
        <h2>Security Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing:4px">${otp}</h1>
        <p>This OTP is valid for <b>30 seconds</b>.</p>
        <p>If you didn’t request this, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordChangedMail(to: string) {
  await transporter.sendMail({
    from: `"EcoWatch Security" <${process.env.SMTP_USER}>`,
    to,
    subject: "Password Changed Successfully",
    html: `
      <div style="font-family:Arial">
        <h2>Password Updated</h2>
        <p>Your account password was changed successfully.</p>
        <p>If this wasn’t you, please contact support immediately.</p>
      </div>
    `,
  });
}
