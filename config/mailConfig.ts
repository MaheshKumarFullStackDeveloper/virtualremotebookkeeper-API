import nodemailer from 'nodemailer'; 
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  transporter.verify((error,success)=>{
    if(error){
      console.log('gmail connection error. plz check gmail configration');
    }else{
        console.log('gmail server is ready');
    }
  });

  const sendEmail = async (to:string,subject:string,body:string)=>{
    await transporter.sendMail({
        from:`"Your Bookcart" <${process.env.EMAIL_USER}>`,
              to, // list of receivers
            subject, // Subject line
            html:body, // html body
    })
  }

  export const sendVerificationToEmail=async(to:string,token:string)=>{
    const verificationUrl= `${process.env.FRONT_URL}/verify-email/${token}`;
    const html =`<h1>Welcom to book cart </h1>
    <p>thanks for registration. Please click on varification link </p><br> <a href="${verificationUrl}"> verification Email</a>`;
    await sendEmail(to,"Please varify your email bookcart",html);
  }

  export const sendRestPasswordToEmail=async(to:string,token:string)=>{
    const verificationUrl= `${process.env.FRONT_URL}/reset-password/${token}`;
    const html =`<h1>Welcom to book cart rest your password</h1>
     <p> ypu have requst to rest password. Please click on varification link </p><br> <a href="${verificationUrl}"> verification Email</a>`;
    await sendEmail(to,"Please reset password book cart",html);
  }