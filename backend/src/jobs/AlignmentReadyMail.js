const Mail = require('./../lib/Mail');

module.exports = {
    key: 'AlignmentReadyMail',
    async handle({ data }) {
        await Mail.sendMail({
            from: 'MASA Team <masateam@unb.br>',
            to: `${data.name} <${data.email}>`,
            subject: 'Your sequence alignment is ready!',
            html: `Hello ${data.name},
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
}