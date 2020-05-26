interface RedisConfiguration {
  host?: string;
  port?: number;
}

const redisConfig: RedisConfiguration = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

export default redisConfig;
