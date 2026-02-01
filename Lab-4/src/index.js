require('dotenv').config();

const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Chat endpoint: http://localhost:${PORT}/api/chat`);
    console.log(`Analyze endpoint: http://localhost:${PORT}/api/analyze`);
});
