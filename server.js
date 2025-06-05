// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
//const projectRoutes = require('./routes/projectRoutes1');
//app.use('/api/projects', projectRoutes);

app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/releases', require('./routes/releaseRoutes'));
app.use('/api/runs', require('./routes/runRoutes'));
app.use('/api/testcases', require('./routes/testCaseRoutes'));


// Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
