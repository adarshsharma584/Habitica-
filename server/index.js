import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { generatePlan } from './agent.js';
import { getContactEmailTemplate } from './utils/emailTemplate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'AI Agent server is running' });
});

app.get("/", (req, res) => {
    res.send("AI Agent server is running")
})

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { firstName, lastName, email, subject, message } = req.body;

        if (!firstName || !email || !message) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_ADDRESS,
            replyTo: email,
            subject: `Contact Form: ${subject || 'New Message'}`,
            html: getContactEmailTemplate(firstName, lastName, email, subject, message)
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            error: 'Failed to send email',
            message: error.message
        });
    }
});

// Generate plan endpoint
app.post('/api/generate-plan', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                error: 'Invalid request. Expected messages array.'
            });
        }

        console.log('Processing conversation history for Habitica AI...');
        const result = await generatePlan(messages);

        res.json({ success: true, ...result });
    } catch (error) {
        console.error('Error generating plan:', error);
        res.status(500).json({
            error: 'Failed to process request',
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 AI Agent server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
