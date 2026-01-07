const express = require('express');
const cors = require('cors');

const sensorRoutes = require('./routes/sensorRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', sensorRoutes);

app.get('/', (req, res) => {
  res.send('API Sensor Cahaya Aktif 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
