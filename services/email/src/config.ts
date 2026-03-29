import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2025'),
})

export const defaultSender = process.env.DEFAULT_SENDER_EMAIL || 'admin@examploe.com'