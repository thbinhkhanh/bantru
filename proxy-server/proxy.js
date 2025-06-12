const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); // ✅ dùng axios chứ KHÔNG fetch

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.post('/proxy', async (req, res) => {
  console.log('📥 Nhận request:', req.body);

  try {
    const response = await axios.post(
      'https://script.google.com/macros/s/AKfycbw5Yh0BkVrgAOyKjpxJktnx9C4g2IGK5wqghdhXp2SuDT5BkbwR7nQHH-hI3Gg1u8_qUg/exec',
      req.body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    res.json(response.data);
  } catch (error) {
  console.error('❌ Proxy lỗi:', error.toString());
  console.error('📄 error.stack:', error.stack);
  res.status(500).json({
    success: false,
    message: 'Lỗi proxy',
    error: error.message || String(error),
  });
}

});

app.listen(PORT, () => {
  console.log(`✅ Proxy server đang chạy tại http://localhost:${PORT}`);
});
