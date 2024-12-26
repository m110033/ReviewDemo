export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/employee',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'p2s5v8y/B?E(H+MbQeThWmZq4t7w!z%C',
    expiresIn: '24h',
  },
});
