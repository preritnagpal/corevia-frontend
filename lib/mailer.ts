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
    from: `"Corevia Security" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your One-Time Verification Code",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.6; color:#111;">
        <h2 style="margin-bottom:10px;">Security Verification Required</h2>

        <p>
          We received a request to verify your identity for your
          <b>EcoWatch</b> account.
        </p>

        <p>Please use the following one-time verification code:</p>

        <div style="
          margin:20px 0;
          padding:15px;
          background:#f4f6f8;
          border-radius:8px;
          text-align:center;
        ">
          <span style="
            font-size:28px;
            letter-spacing:6px;
            font-weight:bold;
          ">
            ${otp}
          </span>
        </div>

        <p>
          ⏱️ This code is valid for <b>30 seconds</b> and can be used only once.
        </p>

        <p style="margin-top:20px;">
          If you did not request this verification, please ignore this email.
          No further action is required.
        </p>

        <hr style="margin:30px 0;" />

        <p style="font-size:12px; color:#555;">
          This is an automated security message. Please do not reply to this email.
        </p>
      </div>
    `,
  });
}


export async function sendPasswordChangedMail(to: string) {
  await transporter.sendMail({
    from: `"Corevia Security" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your EcoWatch Password Has Been Updated",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.6; color:#111;">
        <h2 style="margin-bottom:10px;">Password Successfully Updated</h2>

        <p>
          This is a confirmation that the password for your
          <b>EcoWatch</b> account was changed successfully.
        </p>

        <p>
          If you made this change, no further action is required.
        </p>

        <p style="margin-top:15px;">
          ⚠️ <b>If you did not perform this action</b>, please contact our support
          team immediately and secure your account.
        </p>

        <hr style="margin:30px 0;" />

        <p style="font-size:12px; color:#555;">
          This is an automated security notification. Replies to this email are not monitored.
        </p>
      </div>
    `,
  });
}

