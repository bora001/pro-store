import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PWD,
  },
});

export const sendVerificationEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your email to sign up for pro-store",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img alt="Pro-Store logo" width="40" height="40" src="${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png" style="display: block"/>
          <h1 style="font-size: 20px; margin-left:8px; line-height:1">Pro-Store</h1>
        </div>
        <div style="font-size: 16px; color: #333;">
          <p>Hello! 🙌</p>
          <p>Please enter the verification code below in the sign-up form.</p>
          <span style="display: inline-block; margin-top: 16px; padding: 12px 20px; background-color: #111827; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            ${token}
          </span>
        </div>
      </div>

    `,
  };

  await transporter.sendMail(mailOptions);
};
