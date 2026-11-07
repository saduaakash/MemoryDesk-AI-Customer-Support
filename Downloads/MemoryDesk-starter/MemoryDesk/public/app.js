const $ = (id) => document.getElementById(id);
let customerId = "rahul-01";
let conversationCount = 0;

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2800);
}

function addMessage(text, who = "bot") {
  const row = document.createElement("div");
  row.className = `message-row ${who === "user" ? "user" : ""}`;
  const avatar = who === "user" ? "" : '<div class="bot-avatar">M</div>';
  const sender = who === "user" ? "You" : "MemoryDesk Assistant";
  const wrap = document.createElement("div");
  wrap.className = "bubble-wrap";
  const name = document.createElement("span");
  name.className = "sender";
  name.textContent = sender;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  const time = document.createElement("small");
  time.className = "time";
  time.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  wrap.append(name, bubble, time);
  if (who === "user") row.append(wrap); else row.insertAdjacentHTML("afterbegin", avatar), row.append(wrap);
  $("messages").append(row);
  $("messages").scrollTop = $("messages").scrollHeight;
}

function showMemories(memories) {
  const list = $("memoryList");
  list.innerHTML = "";
  if (!memories.length) {
    list.className = "memory-empty";
    list.innerHTML = '<div class="brain-icon">◈</div><b>No matching memories yet</b><p>Have a conversation first, then ask about that information.</p>';
    return;
  }
  list.className = "memory-list";
  memories.forEach((memory) => {
    const item = document.createElement("div");
    item.className = "memory-item";
    item.textContent = memory;
    list.append(item);
  });
}

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    $("connectionText").textContent = data.hindsightConfigured && data.aiConfigured ? "AI + Hindsight connected" : "Add API keys to connect";
    $("memoryStatus").textContent = data.hindsightConfigured ? "Connected" : "Not connected";
  } catch {
    $("connectionText").textContent = "Server unavailable";
    $("memoryStatus").textContent = "Offline";
  }
}

$("chatForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = $("messageInput").value.trim();
  if (!message) return;
  $("messageInput").value = "";
  addMessage(message, "user");
  conversationCount++;
  $("conversationCount").textContent = conversationCount;
  const pending = "MemoryDesk is thinking…";
  addMessage(pending);
  const lastBubble = $("messages").lastElementChild.querySelector(".bubble");
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, message })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");
    lastBubble.textContent = data.answer;
    showMemories(data.memoriesUsed || []);
  } catch (error) {
    lastBubble.textContent = error.message;
    toast(error.message);
  }
});

async function exploreMemory() {
  const query = prompt("What should MemoryDesk remember about this customer?", "What issues has this customer reported previously?");
  if (!query) return;
  try {
    const response = await fetch("/api/recall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, query })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Recall failed");
    showMemories(data.memories || []);
    toast(`${data.memories?.length || 0} memories retrieved`);
  } catch (error) {
    toast(error.message);
  }
}

$("refreshMemory").addEventListener("click", exploreMemory);
$("memoryNav").addEventListener("click", exploreMemory);
$("chatNav").addEventListener("click", () => $("messageInput").focus());
$("newChatBtn").addEventListener("click", () => {
  $("messages").innerHTML = "";
  addMessage("New conversation started. I will use the same customer's saved Hindsight memories when relevant.");
  $("messageInput").focus();
});
$("changeCustomer").addEventListener("click", () => {
  const value = prompt("Enter a customer ID. Use the same ID to retrieve the same customer's memories.", customerId);
  if (!value?.trim()) return;
  customerId = value.trim();
  $("customerLabel").textContent = customerId;
  $("statCustomer").textContent = customerId;
  $("messages").innerHTML = "";
  addMessage(`Customer switched to ${customerId}. Previous messages for this customer can be recalled from Hindsight.`);
  showMemories([]);
});
checkHealth();
