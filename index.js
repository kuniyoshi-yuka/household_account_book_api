const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();  // .env ファイルの読み込み

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  try {
    const { userId, amount, category, description, date } = req.body;

    // データベースに家計簿の情報を保存
    const result = await pool.query(
      'INSERT INTO expenses (user_id, amount, category, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, amount, category, description, date]
    );

    console.log('Inserted expense:', result.rows[0]);

    res.sendStatus(200); // LINEに成功を通知
  } catch (err) {
    console.error('Error saving expense:', err);
    res.sendStatus(500); // エラーを返す
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
