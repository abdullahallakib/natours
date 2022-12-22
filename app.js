const path = require("path");
const express = require("express");
const morgan = require("morgan");
const { head } = require("./routers/toursRouter");
const ratelimit = require("express-rate-limit");
const AppError = require("./utilits/appError");
const globalErrorHandler = require("./controllers/ErrorControl");
const toursRouter = require("./routers/toursRouter");
const usersRouter = require("./routers/usersRouter");
const reviewRouter = require("./routers/reviewRouter");
const bookingRouter = require("./routers/bookingsRouter");
const viewRoter = require("./routers/viewRoutes");
const helmet = require("helmet");
const mongosanitze = require("express-mongo-sanitize");
const xss_clean = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const app = express();

// start express app
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "public")));

// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const limiter = ratelimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  massage: "Too many requests from this IP,please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongosanitze());
app.use(xss_clean());

app.use(hpp());

const date = new Date().toString();
// console.log(date);
app.use((req, res, next) => {
  req.requestTime = date;
  console.log(req.cookies);
  next();
});

// // //

app.use("/", viewRoter);
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;

//? sarver requiest 1
/* app.get('/hello', (req, res) => {
  res
    .status(404)
    .json({ message: 'hello from the sarver side', app: 'Natours' });
});

//*sarver post 1 

app.post('/', (req, res) => {
  res.send('you can post to this endpoint');
});

*/

//! method 1..
// app.get('/api/v1/tours', getalltours);
// app.post('/api/v1/tours', posttour);
// app.get('/api/v1/tours/:id', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//! method 2..

/* app.route('/api/v1/tours').get(getalltours).post(postour);

app
  .route('/api/v1/tours/:id')
  .get(createTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getallusers).post(createusers);

app
  .route('/api/v1/users/:id')
  .get(getusers)
  .patch(updateusers)
  .delete(deleteusers);
 */

//!mounting multiple routers
