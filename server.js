const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dataPath = path.join(__dirname, 'data', 'items.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readData() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

function writeData(items) {
  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2), 'utf-8');
}

app.get('/api/items', (req, res) => {
  const items = readData();
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const items = readData();
  const { title, description = '', completed = false } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required.' });
  }

  const nextId = items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
  const newItem = { id: nextId, title, description, completed: Boolean(completed) };
  items.push(newItem);
  writeData(items);

  res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
  const items = readData();
  const id = Number(req.params.id);
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  const { title, description, completed } = req.body;
  if (title !== undefined) items[index].title = title;
  if (description !== undefined) items[index].description = description;
  if (completed !== undefined) items[index].completed = Boolean(completed);

  writeData(items);
  res.json(items[index]);
});

app.delete('/api/items/:id', (req, res) => {
  const items = readData();
  const id = Number(req.params.id);
  const filtered = items.filter((item) => item.id !== id);

  if (filtered.length === items.length) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  writeData(filtered);
  res.json({ success: true });
});

app.use((req, res) => {
  res.status(404).send('Resource not found');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
