const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Groq = require('groq-sdk');

const app = express();

// إعدادات CORS للسماح لأي متصفح بالاتصال
app.use(cors());
app.use(express.json());

// تهيئة عميل Groq (تأكد أن مفتاح الـ API مضبوط في متغيرات البيئة في Railway)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// دالة لقراءة بيانات العملاء بمرونة من ملف clients.json الخارجي
function getClientsData() {
  try {
    if (fs.existsSync('clients.json')) {
      const data = fs.readFileSync('clients.json', 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading clients.json", err);
  }
  return {};
}

// مسار استقبال رسائل الشات
app.post('/api/chat', async (req, res) => {
  try {
    const { message, clientId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "الرسالة مطلوبة" });
    }

    // جلب أحدث بيانات العملاء من ملف clients.json
    const clientsData = getClientsData();
    const client = clientsData[clientId];

    // التحقق مما إذا كان العميل غير موجود أو تم إيقاف حسابه (active: false)
    if (!client || client.active === false) {
      return res.json({ 
        reply: "عذراً، هذه الخدمة متوقفة مؤقتاً أو انتهت صلاحية الاشتراك. يرجى التواصل مع الإدارة." 
      });
    }

    // طباعة معرف العميل في لوحة تحكم Railway للتأكد
    console.log("Received request for client ID:", clientId);

    const systemPrompt = client.prompt || "أنت مساعد ذكي ومفيد.";

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
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

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});