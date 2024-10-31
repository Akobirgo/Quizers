const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
require("dotenv").config();
const indexRouter = require("./routes/index");  


const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const main = async () => {
  await mongoose.connect(`mongodb+srv://Loyiha:0118@quizers.rkjnb.mongodb.net/quizers`);
};

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("ejs", path.join(__dirname, "views"));

app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());

const sessionConfig = {
  secret: process.env.ACCESS_TOKEN_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

app.use((req, res, next) => {
  res.locals.user_id = req.session.user_id;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');

  next();
})

app.use("/", indexRouter);

app.all("*", (_, __, next) => {
  next(new ExpressError("Page not found!", 404));
});

app.use((err, _, res, __) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render('404', { status, message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,'localhost', () => { 
  console.log(`Listening on port ${PORT}`);
});