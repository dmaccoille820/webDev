import express from 'express';
import dashboardRoutes from './server/routes/dashboardRoutes.js';
import tasksRoutes from './server/routes/tasksRoutes.js';
import registerRoutes from './server/routes/auth/registerRoutes.js';
import loginRoutes from './server/routes/auth/loginRoutes.js';
import logoutRoutes from './server/routes/auth/logoutRoutes.js';
import { sessionMiddleware } from './server/middleware/sessionMiddleware.js';
import userRoutes from './server/routes/user/userRoutes.js';
import path from 'path';
const { join } = path;
import { dirname } from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

import fs from 'fs';

const app = express();

const port = parseInt(process.env.PORT) || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Read the secret key synchronously from the file
global.secretKey = fs.readFileSync(path.join(__dirname, 'server/secret_key2.txt'), 'utf8').trim();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(secretKey,{httpOnly: true}));
app.use(express.static(join(__dirname, 'client')));
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'client', 'index.html'));
});

// Public API Routes (Register)
app.post('/api/check-username', registerRoutes);
app.post('/api/logout', logoutRoutes);

app.use("/api/login",sessionMiddleware, loginRoutes);

app.post('/api/register', registerRoutes)
// Protected Routes (API)
app.use('/api/dashboard', sessionMiddleware, dashboardRoutes);
app.use('/api/tasks', sessionMiddleware, tasksRoutes);
app.use("/api/user-data", sessionMiddleware, userRoutes);
app.get('/dashboard', (req, res) => {
  res.sendFile(join(__dirname, 'client', 'dashboard.html'));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
