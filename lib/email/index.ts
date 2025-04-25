"use server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PWD,
  },
});

export const sendEmail = async ({
  html,
  to,
  subject,
}: {
  html: string;
  to: string;
  subject: string;
}) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: `Error sending email : ${err}`,
    };
  }
};
