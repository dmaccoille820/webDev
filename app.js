import express from 'express';
import session from 'express-session';
import * as dashboardRoutes from './server/routes/dashboardRoutes.js';
import * as tasksRoutes from './server/routes/tasksRoutes.js';
import * as registerRoutes from './server/routes/registerRoutes.js';
import * as loginRoutes from './server/routes/loginRoutes.js';
import * as logoutRoutes from './server/routes/logoutRoutes.js';
import { sessionMiddleware } from './server/middleware/sessionMiddleware.js';
import * as userRoutes from './server/routes/userRoutes.js';
import path from 'path';
import fs from 'fs';
import.meta.url;
import { dirname } from 'path';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import favicon from 'serve-favicon';

dotenv.config(); 

const app = express();
const port = parseInt(process.env.PORT) || 3000; 

//Secret
const secretKey = process.env.SECRET_KEY;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//View engine
app.set("view engine", "ejs"); 
app.set("views", "./server/views"); 

//Middleware
app.use(express.static(path.join(__dirname, "client"))); 
app.use(favicon(path.join(__dirname, "client/images", "favicon.ico"))); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ 
    secret: secretKey, 
  resave: false, 
  saveUninitialized: true, 
  cookie: {
      httpOnly: true,
      secure: false, 
      maxAge: 3600 * 1000, 
    },
}));

// Public Routes
app.get("/", (req, res) => {
  res.render("register");
});
app.use("/", registerRoutes.default);
app.use("/api/login", loginRoutes.default);
app.use("/", logoutRoutes.default); 

app.use(sessionMiddleware); 

app.get("/tasks", async (req, res) => { 
  console.log(req.session.user.username);
  console.log("User:", req.session.user);
  try{
      const userId = req.userId.user_id;
      const tasksResult = await tasksRoutes.getTasks(); 
      const tasks = tasksResult.length > 0 ? tasksResult: [];
      res.render("tasks", { 
          user: req.session.user,
          tasks: tasks,
      });
  } catch (error) {
      console.error("Error retrieving tasks:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/api/check-username', registerRoutes.default);
app.post('/api/logout', logoutRoutes.default);
app.use("/api/register", registerRoutes.default); 
app.use('/api/tasks', tasksRoutes.default); 
app.use("/api/user-data", userRoutes.default); 
app.use('/api/dashboard', dashboardRoutes.default); 

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
