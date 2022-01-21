import { convert } from 'html-to-text';
import nodemailer from 'nodemailer';
import path from 'path';
import { renderFile } from 'pug';

import config from '../../config';
import bull from '../../infra/bull';

/**
 * Class for method reusability. Email is usually pushed to a Bull queue
 * to be processed later by the lightweight queue.
 */
class Email {
  public to: string;
  public name: string;
  public from: string;

  /**
   * Initialize class.
   *
   * @param to - Which email address is this for?
   * @param name - The name of the receiver.
   */
  constructor(to: string, name: string) {
    this.to = to;
    this.name = name;
    this.from =
      config.NODE_ENV === 'production'
        ? `${config.EMAIL_FROM} <${config.EMAIL_USERNAME}>`
        : `${config.EMAIL_FROM} <${config.MAILTRAP_USERNAME}>`;
  }

  /**
   * Creates a new transport that is used to send emails.
   * Production version will use Webmail/CPanel, while development version
   * will use Mailtrap.
   *
   * @returns Nodemailer transport.
   */
  newTransport() {
    if (config.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: config.EMAIL_HOST,
        port: config.EMAIL_PORT,
        secure: true,
        requireTLS: true,
        auth: {
          user: config.EMAIL_USERNAME,
          pass: config.EMAIL_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: config.MAILTRAP_HOST,
      port: config.EMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.MAILTRAP_USERNAME,
        pass: config.MAILTRAP_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });
  }

  /**
   * Sends an email with a chosen template.
   *
   * @param subject - Subject of the email.
   * @param template - The template to be used for the email.
   * @param vars - Local variables inside the Pug template.
   */
  async send(
    subject: string,
    template: 'otp' | 'notification',
    vars: Record<string, unknown>
  ) {
    const html = renderFile(
      path.join(__dirname, 'views', `${template}.pug`),
      vars
    );

    await this.newTransport().sendMail({
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    });
  }

  /**
   * Sends a security alert notification. Will be pushed into a
   * Bull queue to prevent overhead.
   */
  async sendNotification() {
    await bull.add(`email-notification-${this.to}`, {
      task: this.send('Security Alert for Attendance', 'notification', {
        name: this.name,
      }),
    });
  }

  /**
   * Sends an OTP with Email media. Will be pushed into a Bull queue
   * to prevent overhead.
   *
   * @param otp - OTP as a string.
   */
  async sendOTP(otp: string) {
    await bull.add(`email-otp-${this.to}`, {
      task: this.send('Your requested OTP for Attendance', 'otp', {
        otp,
        name: this.name,
      }),
    });
  }
}

export default Email;
