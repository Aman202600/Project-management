const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorMiddleware');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
