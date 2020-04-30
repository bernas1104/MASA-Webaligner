import Mail from '../lib/Mail';

export interface AlignmentReadyMailJob {
  fullName?: string;
  email: string;
  address: string;
}

export default {
  key: 'AlignmentReadyMail',
  async handle(data: AlignmentReadyMailJob): Promise<void> {
    await Mail.sendMail({
      from: 'MASA Team <masateam@unb.br>',
      to: `${data.fullName} <${data.email}>`,
      subject: 'Your sequence alignment is ready!',
      html: `Hello ${data.fullName},
            <br />
            We are writing this e-mail, to let you know that your request for a
            sequence alignment is ready!
            <br />
            <br />
            To access the results, just click <a href="${data.address}">here</a> or
            access the address: ${data.address}.
            <br />
            <br />
            Regards,
            <br />
            <br />
            MASA Team`,
    });
  },
};
