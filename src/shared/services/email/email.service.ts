import { Injectable } from "@nestjs/common";
import * as sgMail from "@sendgrid/mail";

// create reusable transporter object using the default SMTP transport
// let nmTransporter = nodemailer.createTransport({
//   host: "smtp.transip.email",
//   port: 465,
//   secure: true, // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_EMAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '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')

@Injectable()
export class EmailService {
  public domain = "http://localhost:4200";

  constructor() {
    if (process.env.NODE_ENV == "staging") {
      this.domain = "http://localhost:4200";
    } else if (process.env.NODE_ENV == "production") {
      this.domain = "http://localhost:4200";
    } else {
      this.domain = "http://localhost:4200";
    }
  }

  loadTemplate(identifier: string, data: object = {}): string {
    switch (identifier) {
      case "account-verification": {
        const link = this.domain + "/employees/verify-account/" + data[`verification`];
        return `
          <h1>Hello! Greetings of the day.</h1>
          Please click on the link to verify your account<br>
          <a href="${link}">${link}</a>
        `;
      }
      case "forgot-password": {
        const link = this.domain + "/auth/reset-password/" + data[`email`] + "/" + data[`verification`];
        return `
          <h1>Hello! Greetings of the day.</h1>
          Please click on the link to set new password for  your account<br>
          <a href="${link}">${link}</a>
        `;
      }

      default:
        break;
    }
  }

  send(
    toEmail: string,
    subject: string,
    textMessage: string,
    htmlPage: string
  ) {
    // return nmTransporter.sendMail({
    //   from: process.env.SMTP_EMAIL,
    //   to: toEmail, // comma separated emails.
    //   subject: subject, // Subject line
    //   text: textMessage, // plain text body
    //   html: htmlPage, // html body
    // });
    return sgMail
      .send({
        from: 'cap.instruments@gmail.com',
        to: toEmail, // comma separated emails.
        subject: subject, // Subject line
        text: textMessage, // plain text body
        html: htmlPage, // html body
      })
      .then((response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
      })
      .catch((error) => {
        console.error(error)
      })
  }
}