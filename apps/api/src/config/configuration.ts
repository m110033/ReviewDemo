export default () => ({
  port: parseInt(process.env.BACKEND_PORT, 10) || 4000,
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/performance-review',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'p2s5v8y/B?E(H+MbQeThWmZq4t7w!z%C',
    expiresIn: '24h',
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  }
});
