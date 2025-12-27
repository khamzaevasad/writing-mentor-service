import logger from "../../utils/logger";
import transporter from "../nodemailer";

export const sendPasswordResetOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Parolni tiklash kodi ⚡",
    text: `Parolingizni tiklash uchun kod: ${otp}. Ushbu kod 10 daqiqa davomida amal qiladi.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Parolni tiklash</title>
        <style>
          body { 
            font-family: 'Helvetica Neue', Arial, sans-serif; 
            background-color: #f4f4f4; 
            margin: 0; 
            padding: 20px; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
          }
          .header { 
            background: #e74c3c; 
            color: white; 
            text-align: center; 
            padding: 40px 20px; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 500; 
          }
          .content { 
            padding: 40px 30px; 
            text-align: center; 
            color: #333; 
          }
          .otp-box { 
            font-size: 36px; 
            font-weight: bold; 
            letter-spacing: 8px; 
            background: #ffebee; 
            border: 2px dashed #e74c3c; 
            border-radius: 12px; 
            padding: 20px; 
            margin: 30px auto; 
            max-width: 300px; 
            color: #c0392b; 
          }
          .info { 
            font-size: 16px; 
            line-height: 1.6; 
            color: #555; 
            margin: 20px 0; 
          }
          .warning { 
            font-size: 14px; 
            color: #e74c3c; 
            margin-top: 30px; 
            font-weight: 500;
          }
          .footer { 
            background: #f8f9fa; 
            padding: 25px; 
            text-align: center; 
            font-size: 13px; 
            color: #777; 
          }
          @media (max-width: 600px) {
            .otp-box { font-size: 28px; letter-spacing: 6px; }
            .header h1 { font-size: 24px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Parolni tiklash</h1>
          </div>
          <div class="content">
            <p class="info">Salom!</p>
            <p class="info">
              Writing Mentor hisobingiz uchun parolni tiklash so‘rovi yuborildi. 
              Quyidagi bir martalik kodni (OTP) kiriting:
            </p>
            
            <div class="otp-box">${otp}</div>
            
            <p class="info">
              Bu kod <strong>10 daqiqa</strong> davomida amal qiladi.<br>
              Agar siz parolni tiklashni so‘ramagan bo‘lsangiz, ushbu xabarni e’tiborsiz qoldiring va hisobingiz xavfsizligini tekshiring.
            </p>
            
            <p class="warning">
              ⚠️ Ushbu kodni hech kimga bermang! Writing Mentor jamoasi bu kodni hech qachon so‘ramaydi.
            </p>
          </div>
          <div class="footer">
            <p>Writing Mentor jamoasi ❤️</p>
            <p>
              <a href="https://your-website.com">Veb-sayt</a> | 
              <a href="https://instagram.com/yourhandle">Instagram</a> | 
              <a href="https://t.me/yourhandle">Telegram</a>
            </p>
            <p style="margin-top: 15px; color: #aaa;">
              © 2025 Writing Mentor. Barcha huquqlar himoyalangan.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Password recovery code successfully sent to ${email}`);
  } catch (error) {
    console.error(`Error sending password recovery code to ${email}:`, error);
  }
};
