const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());
app.use(express.json()); // 用于解析 JSON 请求体

app.get('/', (req, res) => {
  res.send('ToDo List Web Service is running');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
