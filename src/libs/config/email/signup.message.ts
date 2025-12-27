import logger from "../../utils/logger";
import transporter from "../nodemailer";

export const sendWelcomeEmail = async (
  userEmail: string,
  userName?: string
) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: userEmail,
    subject: "Xush kelibsiz, Writing Mentor jamoasiga! ✍️ Boshlaymizmi?",
    text: `Hurmatli foydalanuvchi,\n\nWriting Mentor platformasiga xush kelibsiz! Sizning hisobingiz ${userEmail} email bilan muvaffaqiyatli yaratildi.\n\nEndi yozish ko'nikmalaringizni oshiring va mentorlarimiz yordamidan foydalaning.\n\nHisobingizga kirish: [veb-sayt linki]\n\nSavollaringiz bo'lsa, javob beramiz!\n\nWriting Mentor jamoasi`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Xush kelibsiz!</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: #4a90e2; color: white; text-align: center; padding: 30px; }
        .content { padding: 30px; text-align: center; }
        .btn { display: inline-block; background: #4a90e2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { background: #eee; padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Xush kelibsiz, Writing Mentor'ga! ✍️</h1>
        </div>
        <div class="content">
          <p>Hurmatli foydalanuvchi,</p>
          <p>Sizning hisobingiz <strong>${userEmail}</strong> bilan muvaffaqiyatli yaratildi. Endi yozish ko'nikmalaringizni rivojlantirish vaqti keldi!</p>
          <p>Writing Mentor sizga professional yozish bo'yicha maslahatlar, mashqlar va mentor yordamini taklif qiladi. Birinchi qadamingizni qo'ying va platformamizni sinab ko'ring.</p>
          <a href="https://your-website.com/login" class="btn">Hisobga kirish</a>
          <p>Yana savollaringiz bo'lsa, bizga yozing – doim yordam beramiz!</p>
        </div>
        <div class="footer">
          <p>Writing Mentor jamoasi ❤️</p>
          <p><a href="https://your-website.com">Veb-sayt</a> | <a href="https://instagram.com/yourhandle">Instagram</a> | <a href="https://telegram.com/yourhandle">Telegram</a></p>
        </div>
      </div>
    </body>
    </html>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Welcome email send to ${userEmail}`);
  } catch (err) {
    console.log(`Failed to send welcome email to ${userEmail}`, err);
  }
};
