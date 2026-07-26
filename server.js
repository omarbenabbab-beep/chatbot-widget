const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();

// إعدادات CORS للسماح لأي متصفح بالاتصال
app.use(cors());
app.use(express.json());

// قاعدة بيانات العملاء وتوجيهات البوت لكل عميل
const clientsData = {
  "marrakech_restaurant": {
    name: "مطعم البركة المغربي",
    prompt: `أنت مساعد ذكي ولطيف لمطعم "البركة" للمأكولات المغربية الأصيلة في مراكش.
معلومات المطعم:
- قائمة الطعام: طاجين دجاج بالحامض (50 درهم)، طاجين لحم بالبرقوق (65 درهم)، كسكس خضار أو لحم (60 درهم)، حريرة وشهيوات مغربية.
- أوقات العمل: يومياً من الساعة 12:00 ظهراً حتى 11:00 ليلاً.
- العنوان: مراكش، قرب جامع الفنا.
- التوصيل: متوفر داخل مراكش عبر الهاتف.
جاوب الزبناء برحابة صدر وبلغة مغربية بسيطة ومفهومة أو بالعربية الفصحى حسب لغة الزبون.`
  }
};

// تهيئة عميل Groq (تأكد أن مفتاح الـ API مضبوط في متغيرات البيئة في Railway)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// مسار استقبال رسائل الشات
app.post('/api/chat', async (req, res) => {
  try {
    const { message, clientId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "الرسالة مطلوبة" });
    }

    // طباعة معرف العميل في لوحة تحكم Railway للتأكد
    console.log("Received request for client ID:", clientId);

    // جلب توجيهات العميل المحدد أو توجيه افتراضي عام
    const client = clientsData[clientId];
    const systemPrompt = client 
      ? client.prompt 
      : "أنت مساعد ذكي ومفيد ومصمم لمساعدة المستخدمين.";

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

// تشغيل السيرفر محلياً (إذا لم يكن على Railway)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});