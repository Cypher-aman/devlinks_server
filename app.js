const express = require('express');
const cors = require('cors');
// const morgan = require("morgan");
const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');
const linkRouter = require('./routes/linkRoutes');
const globalErrorHandler = require('./controllers/errorController');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const app = express();

// if (process.env.NODE_ENV === "production") {
//   app.use(morgan("dev"));
// }

app.use(cors());
app.options('*', cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/devlinks-api', limiter);

app.use(mongoSanitize());

app.use(xss());

app.use('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/devlinks-api/v1/users', userRouter, linkRouter);
console.log('EMAIL_USERNAME', process.env.EMAIL_USERNAME);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
