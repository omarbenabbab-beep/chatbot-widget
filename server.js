require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();

// إعداد CORS شامل
app.use(cors());

app.use(express.json());

// تقديم جميع ملفات مجلد public (بما فيها index.html و chatbot.js)
app.use(express.static(path.join(__dirname, 'public')));

const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: apiKey || 'dummy_key' });

// مسار المحادثة
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "الرسالة مطلوبة" });

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

// إرجاع صفحة index.html لأي مسار آخر
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});