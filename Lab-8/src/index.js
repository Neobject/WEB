require("dotenv").config();

const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
});
