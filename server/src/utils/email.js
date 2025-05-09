const nodemailer = require("nodemailer");
const nodemailMailgun = require("nodemailer-mailgun-transport");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.displayName;
    this.url = url;
    this.from = `E-commerce web <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Product mode
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_APP_PASS,
        },
      });
      // return nodemailer.createTransport(
      //   nodemailMailgun({
      //     auth: {
      //       api_key: process.env.MAILGUN_API,
      //       domain: process.env.MAILGUN_DOMAIN,
      //     },
      //   })
      // );

      // return nodemailer.createTransport({
      //   service: "SendGrid",
      //   auth: {
      //     user: process.env.SENDGRID_USERNAME,
      //     pass: process.env.SENDGRID_PASSWORD,
      //   },
      // });
    }

    // Dev mode
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    try {
      const html = pug.renderFile(
        `${__dirname}/../views/email/${template}.pug`,
        {
          firstName: this.firstName,
          url: this.url,
          subject,
        }
      );

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText.convert(html),
      };

      const transport = this.newTransport();
      await transport.sendMail(mailOptions);
      console.log("✅ Email đã được gửi");
    } catch (err) {
      console.error("❌ Lỗi khi gửi email:", err);
    }
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};
