const nodemailer = require("nodemailer");
require('dotenv').config()


const mailSender = async (email, title, body) => {
    try{
            const user = process.env.MAIL_USER ? process.env.MAIL_USER.trim().replace(/["']/g, '') : '';
            const pass = process.env.MAIL_PASS ? process.env.MAIL_PASS.trim().replace(/["'\s]/g, '') : '';
            const host = process.env.MAIL_HOST ? process.env.MAIL_HOST.trim().replace(/["']/g, '') : 'smtp.gmail.com';

            let transporter = nodemailer.createTransport({
                host: host,
                port: 587,
                secure: false, // true for 465, false for other ports
                auth:{
                    user: user,
                    pass: pass,
                },
                tls: {
                    rejectUnauthorized: false // Allows self-signed certificates
                }
            })


            let info = await transporter.sendMail({
                from: `"Study Notion" <${user}>`,
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