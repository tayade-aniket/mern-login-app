import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import ENV from '../config.js';

const nodeConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: ENV.EMAIL,
        pass: ENV.PASSWORD
    }
};

const transporter = nodemailer.createTransport(nodeConfig);

const MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
});

export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    if (!username || !userEmail) {
        return res.status(400).json({ error: "Username and email are required" });
    }

    try {
        const email = {
            body: {
                name: username,
                intro: text || 'Welcome to Mail portal. We\'re very excited to have you on board.',
                outro: 'Need help, or have questions? Just reply to this mail, we\'d love to help.'
            }
        };

        const emailBody = MailGenerator.generate(email);

        const message = {
            from: ENV.EMAIL,
            to: userEmail,
            subject: subject || "Signup Successful!",
            html: emailBody
        };

        await transporter.sendMail(message);

        return res.status(200).json({ msg: "You should receive an email from us." });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: "Failed to send email" });
    }
};