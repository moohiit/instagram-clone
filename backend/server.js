import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { configDotenv } from 'dotenv';
import connectDb from './utils/db.js';
import userRoutes from "./routes/user.routes.js";
import postRoutes from './routes/post.routes.js';
import messageRoutes from './routes/message.routes.js';
import {server,app} from './socket.io/socket.io.js'
import path from 'path'

//Configure environment Variables
configDotenv({});
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }))
const corsOptions = {
  origin: process.env.URL,
  credentials: true,
}
//Cross-origin Request Handling using cors
app.use(cors(corsOptions));

// All Api Call here
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/message', messageRoutes);


//Serve the static frontend
app.use(express.static(path.join(__dirname, "/frontend/dist")))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})
//Listen the app on a port
server.listen(PORT, () => {
  connectDb();
  console.log(`Server is running at port ${PORT}`);
})