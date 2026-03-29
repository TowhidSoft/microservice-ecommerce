import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'

dotenv.config();

const app = express()
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP' })
})

// app.use((req, res, next) => {
//     const allowedOrigins = [
//         'http://localhost:8081',
//         'http://127.0.0.1:8081',
//         'http://localhost:4006',
//     ]
//     const origin = req.headers.origin || "";

//     if (allowedOrigins.includes(origin)) {
//         res.setHeader('Access-Control-Allow-Origin', origin);
//         next();
//     } else {
//         res.status(403).json({ message: 'Forbidden' });
//     }
// })

// routes


// Error handler
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
})

const port = process.env.PORT || 4007;
const serviceName = process.env.SERVICE_NAME || 'Order-Service';

app.listen(port, () => {
    console.log(`${serviceName} us running on port ${port}`);

})