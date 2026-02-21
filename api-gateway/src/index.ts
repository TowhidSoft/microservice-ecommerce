import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'

dotenv.config();

const app = express()
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


// 404 handler
app.use((_req, res) => {
    res.status(404).json({message: 'Route not found'})
})


app.listen(port, () => {
    console.log(`${serviceName} us running on port ${port}`);

})