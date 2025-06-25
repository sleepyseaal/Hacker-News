import nodemailer from "nodemailer";

let transporter;

async function getTransporter() {
  if (!transporter) {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return transporter;
}

export async function sendEmail({ to, subject, html }) {
  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: '"Hacker News" <no-reply@hacker-news.com>',
    to,
    subject,
    html,
  });

  console.log("📧 Email sent. Preview it here:");
  console.log(nodemailer.getTestMessageUrl(info));
}

export default sendEmail;
