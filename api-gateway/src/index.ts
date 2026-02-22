import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { configureRoutes } from './util';

dotenv.config();

const app = express()

// security middleware
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) => {
        res.status(429).json({message: "Too many requests, please try again later."})
    }
})
app.use('/api', limiter)


// request logger 
app.use(morgan('dev'))
app.use(express.json())

// Auth middleware

configureRoutes(app)


// 404 handler
app.use((err,_req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: 'Internal Server Error'})
})

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
})

// health check
app.get('/health', (_req, res) => {
    res.json({message: 'API Gateway is running'})
})