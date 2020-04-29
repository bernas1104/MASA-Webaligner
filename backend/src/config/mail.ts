interface MailerConfiguration {
  host?: string;
  port?: number;
  auth: {
    user?: string;
    pass?: string;
  };
}

const mailConfig: MailerConfiguration = {
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};

export default mailConfig;
