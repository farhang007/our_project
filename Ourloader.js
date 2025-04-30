
(function () {
  const style = document.createElement('style');
  style.innerHTML = `
    #carquestChatBubble {
      position: fixed; bottom: 20px; left: 20px;
      background: #d32f2f; color: white; padding: 14px 24px;
      font-size: 1.2em; border-radius: 50px; cursor: pointer;
      z-index: 9999; font-weight: bold;
      display: flex; align-items: center; gap: 10px;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }
    #carquestChatWindow {
      position: fixed; bottom: 90px; left: 20px; width: 320px;
      background: white; border: 2px solid #d32f2f;
      border-radius: 10px; display: none;
      z-index: 9999; font-family: Arial; flex-direction: column;
      max-height: 500px; box-shadow: 0 8px 16px rgba(0,0,0,0.4);
    }
    #chatHeader { background: #d32f2f; color: white; padding: 10px; font-weight: bold; }
    #chatBody { padding: 10px; overflow-y: auto; flex: 1; font-size: 13px; }
    .chat-msg { margin-bottom: 10px; }
    .chat-user { font-weight: bold; }
    .chat-time { font-size: 11px; color: #777; }
    #chatInputArea, #chatForm { padding: 10px; }
    #chatInputArea textarea, #chatForm input {
      width: 100%; padding: 6px; font-size: 13px;
      border-radius: 5px; border: 1px solid #ccc;
    }
    #chatInputArea button, #chatForm button {
      background: #d32f2f; color: white; border: none;
      padding: 8px; width: 100%; margin-top: 5px;
      border-radius: 5px; font-weight: bold; cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  const html = document.createElement('div');
  html.innerHTML = `
    <div id="carquestChatBubble" onclick="toggleChat()">💬 Chat with Our Team</div>
    <div id="carquestChatWindow">
      <div id="chatHeader">Car Quest Support</div>
      <div id="chatForm">
        <input type="text" id="cq_fname" placeholder="First Name" required>
        <input type="text" id="cq_lname" placeholder="Last Name" required>
        <input type="email" id="cq_email" placeholder="Email" required>
        <input type="tel" id="cq_phone" placeholder="Phone" required>
        <button onclick="startChat()">Start Chat</button>
      </div>
      <div id="chatBody" style="display:none;"></div>
      <div id="chatInputArea" style="display:none;">
        <textarea id="chatMessage" placeholder="Type your message..."></textarea>
        <button onclick="sendMessage()">Send</button>
      </div>
    </div>
  `;
  document.body.appendChild(html);

  let userInfo = {};
  window.toggleChat = function() {
    const w = document.getElementById("carquestChatWindow");
    w.style.display = w.style.display === "none" ? "flex" : "none";
  };
  window.startChat = function() {
    const f = v("cq_fname"), l = v("cq_lname"), e = v("cq_email"), p = v("cq_phone");
    if (!f || !l || !e || !p) return alert("Please fill out all fields.");
    userInfo = { fname: f, lname: l, email: e, phone: p };
    show("chatBody"); show("chatInputArea"); hide("chatForm");
    appendMsg("System", `Hi ${f}, how can we help you today?`);
  };
  window.sendMessage = function() {
    const m = v("chatMessage");
    if (!m) return;
    appendMsg("You", m); document.getElementById("chatMessage").value = ""; sendToN8n(m);
  };
  function appendMsg(sender, text) {
    const b = document.getElementById("chatBody"), t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const d = document.createElement("div"); d.className = "chat-msg";
    d.innerHTML = `<div class="chat-user">${sender}</div><div>${text}</div><div class="chat-time">${t}</div>`;
    b.appendChild(d); b.scrollTop = b.scrollHeight;
  }
  async function sendToN8n(msg) {
    appendMsg("Support", ""); const b = document.getElementById("chatBody");
    const r = b.querySelectorAll(".chat-msg:last-child")[0].children[1];
    try {
      const res = await fetch("https://your-n8n-instance.com/webhook/chat?key=secure123", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userInfo.fname, email: userInfo.email, phone: userInfo.phone, message: msg
        })
      });
      const data = await res.json(), reply = data.reply || "Thanks! We'll follow up.";
      let i = 0, interval = setInterval(() => {
        r.textContent += reply[i]; i++; b.scrollTop = b.scrollHeight;
        if (i >= reply.length) clearInterval(interval);
      }, 30);
    } catch (e) { r.textContent = "Sorry, something went wrong."; }
  }
  const v = id => document.getElementById(id).value.trim();
  const show = id => document.getElementById(id).style.display = "block";
  const hide = id => document.getElementById(id).style.display = "none";
})();
