// إنشاء وتصميم نافذة الشات في الصفحة تلقائياً
(function () {
  const styles = `
    #chatbot-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: Tahoma, sans-serif;
      direction: rtl;
    }
    #chatbot-btn {
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 20px;
      cursor: pointer;
      font-size: 16px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
    #chatbot-box {
      display: none;
      width: 320px;
      height: 400px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      flex-direction: column;
      overflow: hidden;
      position: absolute;
      bottom: 60px;
      right: 0;
    }
    #chatbot-header {
      background: #007bff;
      color: white;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #chatbot-close {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
    }
    #chatbot-messages {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .chat-msg {
      padding: 8px 12px;
      border-radius: 8px;
      max-width: 80%;
      line-height: 1.4;
    }
    .user-msg {
      background: #007bff;
      color: white;
      align-self: flex-end;
    }
    .bot-msg {
      background: #f1f1f1;
      color: #333;
      align-self: flex-start;
    }
    #chatbot-input-area {
      display: flex;
      border-top: 1px solid #ddd;
      padding: 8px;
      background: #fff;
    }
    #chatbot-input {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 6px;
      outline: none;
    }
    #chatbot-send {
      background: #007bff;
      color: white;
      border: none;
      padding: 6px 12px;
      margin-right: 6px;
      border-radius: 4px;
      cursor: pointer;
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  const container = document.createElement("div");
  container.id = "chatbot-container";
  container.innerHTML = `
    <button id="chatbot-btn">💬 المساعد الذكي</button>
    <div id="chatbot-box">
      <div id="chatbot-header">
        <span>المساعد الذكي</span>
        <button id="chatbot-close">✕</button>
      </div>
      <div id="chatbot-messages">
        <div class="chat-msg bot-msg">مرحباً بك! كيف يمكنني مساعدتك اليوم؟</div>
      </div>
      <div id="chatbot-input-area">
        <input type="text" id="chatbot-input" placeholder="اكتب رسالتك هنا..." />
        <button id="chatbot-send">إرسال</button>
      </div>
  </div>
  `;
  document.body.appendChild(container);

  const btn = document.getElementById("chatbot-btn");
  const box = document.getElementById("chatbot-box");
  const closeBtn = document.getElementById("chatbot-close");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  btn.onclick = () => box.style.display = "flex";
  closeBtn.onclick = () => box.style.display = "none";

  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    // إظهار رسالة المستخدم
    messages.innerHTML += `<div class="chat-msg user-msg">${text}</div>`;
    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    try {
      const clientId = 'marrakech_restaurant';
      
      // الاتصال المباشر بسيرفر Railway
      const res = await fetch('https://chatbot-widget-production-fa1d.up.railway.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          clientId: clientId 
        })
      });

      const data = await res.json();
      const reply = data.reply || "عذراً، حدث خطأ في الرد.";

      messages.innerHTML += `<div class="chat-msg bot-msg">${reply}</div>`;
      messages.scrollTop = messages.scrollHeight;
    } catch (err) {
      messages.innerHTML += `<div class="chat-msg bot-msg">عذراً، تعذر الاتصال بالسيرفر.</div>`;
    }
  }

  sendBtn.onclick = handleSend;
  input.onkeypress = (e) => {
    if (e.key === 'Enter') handleSend();
  };
})();