// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let messages = [];

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  const { user, text } = req.body;
  messages.push({ user, text });
  res.json({ success: true });
});
;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
