require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();

app.use(cors());
app.use(express.json());

// التأكد من وجود المفتاح
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
    if (!message) return res.status(400).json({ error: "Message is required" });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "أنت مساعد ذكي ومفيد." },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
    });

    const reply = completion.choices[0]?.message?.content || "لا توجد إجابة.";
    res.json({ reply });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// المنفذ الصحيح لـ Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
