const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const { pool } = require('./db');

const app = express();

app.use(helmet());
const cookieParser = require('cookie-parser');

const allowedOrigins = [process.env.FRONTEND_URL,process.env.ADMIN_URL].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'db unreachable' });
  }
});

app.use('/api/services', require('./routes/services'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/team', require('./routes/team'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/admin', require('./routes/admin'));

app.use(errorHandler);

module.exports = app;