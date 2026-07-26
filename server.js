require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();

// إعداد CORS يدوي شامل لتجاوز أية قيود من المتصفح
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // الاستجابة الفورية لطلبات التثبت (Preflight requests)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  console.error("WARNING: GROQ_API_KEY is missing!");
}

const groq = new Groq({ apiKey: apiKey || 'dummy_key' });

app.get('/', (req, res) => {
  res.send('Server is running successfully!');
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "الرسالة مطلوبة" });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "أنت مساعد ذكي ومفيد." },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
    });

    const reply = completion.choices[0]?.message?.content || "عذراً، لم أستطع فهم الإجابة.";
    res.json({ reply });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});