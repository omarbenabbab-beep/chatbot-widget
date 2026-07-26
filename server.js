require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// مسار استقبال الرسائل
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "أنت مساعد ذكي ومفيد للزوار، تجيب بأسلوب لطيف ومختصر." },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
    });

    const reply = completion.choices[0]?.message?.content || "عذراً، لم أتمكن من الاستجابة.";
    res.json({ reply });

  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ error: "حدث خطأ في الاتصال بالخادم" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});