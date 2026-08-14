const nodemailer = require("nodemailer");
require('dotenv').config()


const mailSender = async (email, title, body) => {
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                port: 587,
                secure: false, // true for 465, false for other ports
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS ? process.env.MAIL_PASS.replace(/\s+/g, '') : '',
                },
                tls: {
                    rejectUnauthorized: false // Allows self-signed certificates
                }
            })


            let info = await transporter.sendMail({
                from: `"Study Notion" <${process.env.MAIL_USER}>`,
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
                headers: {
                'Precedence': 'Bulk',
                'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply'
                }
            })
            console.log("Email sent successfully:", info.messageId);
            return info;
    }
    catch(error) {
        console.error("Error sending email:", error.message);
        throw error;
    }
}


module.exports = mailSender;