const db = require('../db');

function getStatus(lux) {
  if (lux <= 100) return 'gelap';
  if (lux <= 300) return 'redup';
  if (lux <= 700) return 'terang';
  return 'terang_banget';
}

exports.insertSensor = (req, res) => {
  const { nilai_lux } = req.body;

  if (nilai_lux === undefined) {
    return res.status(400).json({ message: 'nilai_lux wajib diisi' });
  }

  const status = getStatus(nilai_lux);

  db.run(
    `INSERT INTO sensor_cahaya (nilai_lux, status) VALUES (?, ?)`,
    [nilai_lux, status],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({
        message: 'Data sensor berhasil disimpan',
        id: this.lastID,
        nilai_lux,
        status
      });
    }
  );
};

exports.getAllSensor = (req, res) => {
  db.all(
    `SELECT * FROM sensor_cahaya ORDER BY timestamp DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
};

exports.getLatestSensor = (req, res) => {
  db.get(
    `SELECT * FROM sensor_cahaya ORDER BY timestamp DESC LIMIT 1`,
    [],
    (err, row) => {
      if (err) return res.status(500).json(err);
      res.json(row);
    }
  );
};
