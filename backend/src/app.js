const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const authRouter = require('./routes/authRoutes');
const cookieParser = require("cookie-parser");
const profileRouter = require('./routes/profileRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const userRouter = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes') // Add message routes
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const initializeSocket = require('./utils/chat');

initializeSocket(server);

const connected = dbConnect();
connected
  .then(() => {
    console.log("connected to database");
    server.listen(5000, () => {
      console.log("server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Health check endpoint
app.get("/", (req, res) => {
  res.send("api is healthy");
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', connectionRoutes);
app.use('/', userRouter);
app.use('/', messageRoutes); 