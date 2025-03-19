const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const authRouter = require('./routes/authRoutes')
const cookieparser = require("cookie-parser");
const profileRouter = require('./routes/profileRoutes')
const connectionRoutes = require('./routes/connectionRoutes')
const userRouter  = require('./routes/userRoutes')
const connected = dbConnect();
const cors = require('cors')
const User = require('./models/userModels')
connected
  .then(() => {
    console.log("connected to database");
    app.listen(3000, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
app.get("/", (req, res) => {
  res.send("api is healthy");
});
app.use(cors({
  origin:"http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieparser());
app.use('/',profileRouter);
app.use('/',authRouter);
app.use('/',connectionRoutes);
app.use('/',userRouter);


app.get("/user", async (req, res) => {
  try {
    const users = await User.find({});
    if (users) {
      res.send(users);
    }
  } catch (error) {
    console.log(error);
    res.send("cant find data ");
  }
});

