const chatBtn = document.getElementById("chatBtn");
const chatPanel = document.getElementById("chat");
const chatClose = document.getElementById("chatX");
const chatForm = document.getElementById("cf");
const chatInput = document.getElementById("ci");
const chatMsgs = document.getElementById("msgs");
const chatQs = document.getElementById("qs");

const quickQuestions = [
  "What projects has Arpit built?",
  "What skills does he have?",
  "How can I contact him?",
  "What is Arpit studying?"
];

function addMessage(text, isUser = false) {
  const bubble = document.createElement("div");
  bubble.className = isUser ? "msg user" : "msg bot";
  bubble.textContent = text;
  bubble.setAttribute("role", isUser ? "note" : "status");
  chatMsgs.appendChild(bubble);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.className = "typing-indicator bot";
  typing.setAttribute("aria-live", "polite");
  typing.setAttribute("aria-label", "Assistant is typing");
  typing.innerHTML = "<span></span><span></span><span></span>";
  chatMsgs.appendChild(typing);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
  return typing;
}

function hideTypingIndicator() {
  const typing = chatMsgs.querySelector(".typing-indicator");
  if (typing) typing.remove();
}

function setChatOpen(open) {
  chatPanel.classList.toggle("open", open);
  chatBtn.setAttribute("aria-expanded", String(open));
  chatBtn.setAttribute("aria-label", open ? "Close chat" : "Open chat");
  if (open) {
    chatInput.focus();
  }
}

function renderQuickQuestions() {
  chatQs.innerHTML = quickQuestions
    .map(q => `<button type="button">${q}</button>`)
    .join("");

  chatQs.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      chatInput.value = btn.textContent;
      chatForm.requestSubmit();
    });
  });
}

function answerQuestion(question) {
  const answer = typeof localAnswer === "function" ? localAnswer(question) : "I’m ready to tell you about Arpit’s work, skills and contact details.";
  return answer;
}

chatBtn.addEventListener("click", () => {
  const isOpen = chatPanel.classList.contains("open");
  setChatOpen(!isOpen);
});

chatClose.addEventListener("click", () => setChatOpen(false));

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && chatPanel.classList.contains("open")) {
    setChatOpen(false);
  }
});

chatForm.addEventListener("submit", event => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;

  addMessage(question, true);
  chatInput.value = "";

  const typing = showTypingIndicator();
  setTimeout(() => {
    hideTypingIndicator();
    const answer = answerQuestion(question);
    addMessage(answer, false);
  }, 550);
});

function initChat() {
  renderQuickQuestions();
  addMessage("Hi! 👋 I’m Arpit’s assistant. Ask me about his projects, skills, studies, or how to contact him.", false);
}

initChat();
