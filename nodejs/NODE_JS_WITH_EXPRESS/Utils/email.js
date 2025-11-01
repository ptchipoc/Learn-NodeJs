const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
    // 1.CREATE A TRANSPORTER
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // 2.DEFINE EMAIL OPTIONS
    const emailOptions = {
        from: 'cineflix support<support@cineflix.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transporter.sendMail(emailOptions)
}

module.exports = sendEmail