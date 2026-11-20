document.addEventListener("DOMContentLoaded", () => {
  const base = (window.dwConfig.chatBase || location.origin).replace(/\/$/, "");
  const list = document.querySelector("#messages");
  const form = document.querySelector("#composer");
  const send = document.querySelector("#send");
  const nameInput = document.querySelector("#nickname");
  const messageInput = document.querySelector("#message");
  const feedback = document.querySelector("#feedback");
  const connection = document.querySelector("#connection");
  const visitor = crypto.randomUUID?.() || "xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx".replace(/x/g,()=>Math.floor(Math.random()*16).toString(16));
  let timer, request, online = false, sending = false;
  nameInput.value = sessionStorage.getItem("dw-chat-name") || "";
  const update = () => { send.disabled = !online || sending; };
  async function refresh() {
    clearTimeout(timer);
    if (document.hidden || request) return;
    request=new AbortController();
    try {
      const response=await fetch(base+"/chat/snapshot?visitor="+visitor,{cache:"no-store",signal:request.signal});
      if(!response.ok) throw Error("Unavailable");
      const room=await response.json();
      online = true;
      update();
      connection.textContent = room.online + " connected";
      const atEnd = list.scrollHeight - list.scrollTop - list.clientHeight < 24;
      const rows = room.messages.map(msg => {
        const row = document.createElement("li");
        const who = document.createElement("strong");
        who.textContent = msg.name;
        const bubble = document.createElement("span");
        bubble.textContent = msg.text;
        row.append(who,bubble);
        return row;
      });
      list.replaceChildren(...rows);
      if (atEnd) list.scrollTop = list.scrollHeight;
    } catch {
      online=false;update();connection.textContent="Chat server unavailable. Reconnecting…";
    } finally {
      request=null;
      if(!document.hidden)timer=setTimeout(refresh,online?5000:12000);
    }
  }
  form.onsubmit = async event => {
    event.preventDefault();
    if (sending || !online) return;
    sending = true; update();
    try {
      const res = await fetch(base + "/chat/messages", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({name:nameInput.value.trim(), text:messageInput.value.trim()})
      });
      if (!res.ok) throw Error(res.status === 429 ? "Thoda ruk kar bhejo." : "Message send nahi hua.");
      sessionStorage.setItem("dw-chat-name", nameInput.value.trim());
      messageInput.value = ""; feedback.textContent = ""; messageInput.focus();refresh();
    } catch (e) { feedback.textContent = e.message; }
    finally { sending = false; update(); }
  };
  function pause(){clearTimeout(timer);request?.abort();}
  document.addEventListener("visibilitychange",()=>document.hidden?pause():refresh());
  window.addEventListener("pagehide",pause);
  window.addEventListener("pageshow",refresh);
  refresh();
});
