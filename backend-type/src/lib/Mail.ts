import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

export default nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  auth: {
    user: mailConfig.auth.user,
    pass: mailConfig.auth.pass,
  },
});
