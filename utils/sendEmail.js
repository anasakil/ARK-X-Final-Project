const nodemailer = require('nodemailer');
require('dotenv').config()

const sendEmail = async (option) =>{
    const transporter = nodemailer.createTransport({
        host : process.env.EMAIL_HOST,
        port : process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    })
    //Defaine Email Option
    const emailOptions ={
        from :'Anas support<Arkx@mail.com>',
        to:option.email,
        subject:option.subject,
        text:option.message
    }
    await transporter.sendMail(emailOptions);
}
module.exports = sendEmail;