import dotenv from "dotenv";

dotenv.config({
    path: ".env"
})

export const config = {
    port: process.env.PORT || 4006,
    serviceName: process.env.SERVICE_NAME || 'Cart-Service',
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: process.env.REDIS_PORT || "6379",
    cartTTL: process.env.CART_TTL || "60",
    inventoryServiceUrl: process.env.INVENTORY_SERVICE_URL || 'http://localhost:4002'
}