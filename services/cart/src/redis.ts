import Redis from "ioredis"
import { config } from "./config"

const redis = new Redis({
    host: config.redisHost,
    port: Number(config.redisPort)
})

export default redis;