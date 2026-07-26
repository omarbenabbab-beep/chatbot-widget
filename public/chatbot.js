window.addEventListener('DOMContentLoaded', () => {
  // 1. إنشاء الحاوية الرئيسية
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'ai-chatbot-widget';
  
  widgetContainer.innerHTML = `
    <style>
      #ai-chat-button {
        position: fixed;
        bottom: 25px;
        right: 25px;
        background-color: #0070f3;
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 26px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #ai-chat-box {
        display: none;
        position: fixed;
        bottom: 95px;
        right: 25px;
        width: 340px;
        height: 450px;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        flex-direction: column;
        overflow: hidden;
        z-index: 999999;
        font-family: Segoe UI, Tahoma, sans-serif;
        direction: rtl;
      }
      #ai-chat-header {
        background: #0070f3;
        color: white;
        padding: 15px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #ai-chat-messages {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: #f9f9f9;
      }
      .ai-msg {
        padding: 10px 14px;
        border-radius: 10px;
        max-width: 80%;
        font-size: 14px;
        line-height: 1.4;
      }
      .ai-msg.user {
        background: #0070f3;
        color: white;
        align-self: flex-start;
      }
      .ai-msg.bot {
        background: #e9ecef;
        color: #212529;
        align-self: flex-end;
      }
      #ai-chat-input-area {
        display: flex;
        border-top: 1px solid #eee;
        background: white;
      }
      #ai-chat-input {
        flex: 1;
        border: none;
        padding: 12px 15px;
        outline: none;
        font-size: 14px;
      }
      #ai-chat-send {
        background: #0070f3;
        color: white;
        border: none;
        padding: 0 18px;
        cursor: pointer;
        font-weight: bold;
      }
    </style>

    <button id="ai-chat-button">💬</button>
    
    <div id="ai-chat-box">
      <div id="ai-chat-header">
        <span>المساعد الذكي</span>
        <span id="ai-chat-close" style="cursor:pointer; font-size: 20px;">&times;</span>
      </div>
      <div id="ai-chat-messages">
        <div class="ai-msg bot">مرحباً بك! كيف يمكنني مساعدتك اليوم؟</div>
      </div>
      <div id="ai-chat-input-area">
        <input type="text" id="ai-chat-input" placeholder="اكتب رسالتك هنا..." />
        <button id="ai-chat-send">إرسال</button>
      </div>
    </div>
  `;

  document.body.appendChild(widgetContainer);

  const btn = document.getElementById('ai-chat-button');
  const box = document.getElementById('ai-chat-box');
  const closeBtn = document.getElementById('ai-chat-close');
  const sendBtn = document.getElementById('ai-chat-send');
  const input = document.getElementById('ai-chat-input');
  const messagesDiv = document.getElementById('ai-chat-messages');

  btn.onclick = () => {
    box.style.display = (box.style.display === 'flex') ? 'none' : 'flex';
  };
  closeBtn.onclick = () => box.style.display = 'none';

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    messagesDiv.innerHTML += `<div class="ai-msg user">${text}</div>`;
    input.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-msg bot';
    loadingDiv.innerText = 'جاري التفكير...';
    messagesDiv.appendChild(loadingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
     const res = await fetch('https://chatbot-widget-production-11cf.up.railway.app/api/chat', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json' 
  },
  body: JSON.stringify({ message: text }) // أو userInput حسب اسم المتغير لديك
});
      const data = await res.json();
      loadingDiv.innerText = data.reply || 'حدث خطأ في الرد.';
    } catch (err) {
      loadingDiv.innerText = 'تعذر الاتصال بالسيرفر.';
    }
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  sendBtn.onclick = sendMessage;
  input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
});