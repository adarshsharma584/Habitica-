import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generatePlan } from './agent.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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
