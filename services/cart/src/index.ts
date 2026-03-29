import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { addToCart, clearCart } from './controller';
import getMyCart from './controller/getMyCart';
import './events/onKeyExpires';

dotenv.config();

const app = express()
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP' })
})

// routes
app.post('/cart/add-to-cart', addToCart);
app.get('/cart/me', getMyCart);
app.get('/cart/clear', clearCart)


// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' })
})


// Error handler
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
})

const port = process.env.PORT || 4006;
const serviceName = process.env.SERVICE_NAME || 'Cart-Service';

app.listen(port, () => {
    console.log(`${serviceName} us running on port ${port}`);

})