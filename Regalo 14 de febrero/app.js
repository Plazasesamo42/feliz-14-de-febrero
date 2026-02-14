// =====================
// PERSONALIZACIÓN
// =====================
const DEFAULT_NAME = "Fabiana";
const DEFAULT_NICK = "mi negra";

const DEFAULT_TEXT =
`Fabiana, mi negra:
Hoy solo quiero recordarte lo feliz que me hace tenerte en mi vida. Han sido 4 años llenos de
momentos bonitos, risas que se quedan, y conversaciones que llegan justo cuando más se
necesitan.

Gracias por tu forma de estar, por tu cariño, por tu paciencia y por hacerme sentir que no estoy
solo. Te quiero muchísimo, y de verdad valoro cada parte de esta amistad que hemos construido
con el tiempo.

Feliz 14 de febrero. Ojalá la vida nos regale muchos años más así: con confianza, con apoyo, y con
esa conexión especial que no se explica, solo se siente.

ATT: El negro de Jhonny ajajaja`;

const CAPSULES = [
  "Cápsula: Chile ↔ Ecuador… y aún así siempre coincidimos.",
  "Cápsula: Brookhaven fue el inicio, pero la amistad fue lo que se quedó.",
  "Cápsula: gracias por cada conversación que me calmó cuando lo necesitaba.",
  "Cápsula: promesa—siempre te voy a apoyar, estés donde estés.",
  "Cápsula: 4 años después y todavía me alegra haberte conocido jugando.",
  "Cápsula: si el mundo se pone pesado, aquí tienes un lugar seguro conmigo."
];

const QUIZ_ANSWER = "brookhaven";

// =====================
// DOM
// =====================
const els = {
  friendName: document.getElementById("friendName"),
  friendNick: document.getElementById("friendNick"),
  typed: document.getElementById("typed"),

  capsuleTitle: document.getElementById("capsuleTitle"),
  capsuleText: document.getElementById("capsuleText"),

  btnCapsule: document.getElementById("btnCapsule"),
  btnEdit: document.getElementById("btnEdit"),

  dlg: document.getElementById("dlg"),
  btnClose: document.getElementById("btnClose"),
  editName: document.getElementById("editName"),
  editNick: document.getElementById("editNick"),
  editBox: document.getElementById("editBox"),
  btnSave: document.getElementById("btnSave"),
  btnReset: document.getElementById("btnReset"),

  quizA: document.getElementById("quizA"),
  btnCheck: document.getElementById("btnCheck"),
  quizMsg: document.getElementById("quizMsg"),

  hearts: document.getElementById("hearts"),
  btnCopy: document.getElementById("btnCopy"),
  copyMsg: document.getElementById("copyMsg"),
};

// =====================
// Storage
// =====================
const K_NAME = "rbx_pink_name_v1";
const K_NICK = "rbx_pink_nick_v1";
const K_TEXT = "rbx_pink_text_v1";
const K_CAP  = "rbx_pink_cap_i_v1";

const getSaved = (k, fallback) => {
  try { return localStorage.getItem(k) ?? fallback; } catch { return fallback; }
};
const setSaved = (k, v) => {
  try { localStorage.setItem(k, v); } catch {}
};

let name = getSaved(K_NAME, DEFAULT_NAME);
let nick = getSaved(K_NICK, DEFAULT_NICK);
let message = getSaved(K_TEXT, DEFAULT_TEXT);
let capIndex = parseInt(getSaved(K_CAP, "0"), 10);
if (Number.isNaN(capIndex)) capIndex = 0;

// =====================
// Render nombres
// =====================
function renderNames(){
  els.friendName.textContent = name;
  els.friendNick.textContent = nick;
}

// =====================
// Typewriter
// =====================
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function typewriter(text){
  els.typed.textContent = "";
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.textContent = "▍";
  els.typed.appendChild(cursor);

  let out = "";
  for (let i = 0; i < text.length; i++){
    out += text[i];

    els.typed.firstChild?.remove();
    els.typed.textContent = out;
    els.typed.appendChild(cursor);

    const ch = text[i];
    const base = (ch === "\n") ? 150 : 12 + Math.random()*24;
    await sleep(base);
  }
}

// =====================
// Cápsulas
// =====================
function showCapsule(){
  const idx = capIndex % CAPSULES.length;
  els.capsuleTitle.textContent = `Cápsula #${idx + 1}`;
  els.capsuleText.textContent = CAPSULES[idx];
  capIndex++;
  setSaved(K_CAP, String(capIndex));
}

// =====================
// Corazones flotantes
// =====================
function hearts(count = 20){
  const icons = ["❤","💗","💖","💕"];
  for (let i=0; i<count; i++){
    const el = document.createElement("div");
    el.className = "h";
    el.textContent = icons[Math.floor(Math.random()*icons.length)];

    el.style.left = (Math.random()*100) + "vw";
    el.style.top  = (Math.random()*10 + 85) + "vh";
    el.style.fontSize = (12 + Math.random()*18) + "px";
    el.style.opacity = "0.92";

    const dx = (Math.random()*180 - 90);
    const dy = -(180 + Math.random()*240);
    const rot = (Math.random()*420 - 210);
    const dur = 1400 + Math.random()*1100;

    el.animate([
      { transform:`translate(0,0) rotate(0deg)`, opacity: 0 },
      { transform:`translate(${dx*0.25}px, ${dy*0.25}px) rotate(${rot*0.25}deg)`, opacity: 0.92, offset: 0.2 },
      { transform:`translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0 }
    ], { duration: dur, easing: "cubic-bezier(.2,.7,.2,1)", fill:"forwards" });

    els.hearts.appendChild(el);
    setTimeout(() => el.remove(), dur + 30);
  }
}

// =====================
// Editor
// =====================
function openEditor(){
  els.editName.value = name;
  els.editNick.value = nick;
  els.editBox.value = message;
  els.dlg.showModal();
  els.editName.focus();
}
function closeEditor(){ els.dlg.close(); }

els.btnEdit.addEventListener("click", openEditor);
els.btnClose.addEventListener("click", closeEditor);

els.btnSave.addEventListener("click", async () => {
  name = (els.editName.value || "").trim() || DEFAULT_NAME;
  nick = (els.editNick.value || "").trim() || DEFAULT_NICK;
  message = (els.editBox.value || "").trim() || DEFAULT_TEXT;

  setSaved(K_NAME, name);
  setSaved(K_NICK, nick);
  setSaved(K_TEXT, message);

  renderNames();
  closeEditor();
  await typewriter(message);
});

els.btnReset.addEventListener("click", () => {
  els.editName.value = DEFAULT_NAME;
  els.editNick.value = DEFAULT_NICK;
  els.editBox.value = DEFAULT_TEXT;
});

// =====================
// Quiz
// =====================
els.btnCheck.addEventListener("click", () => {
  const v = (els.quizA.value || "").trim().toLowerCase();
  if (!v){
    els.quizMsg.textContent = "Escribe una respuesta primero.";
    return;
  }
  if (v === QUIZ_ANSWER){
    els.quizMsg.innerHTML = `<b style="color:var(--good)">Correcto.</b> Desbloqueado.`;
    hearts(60);
  } else {
    els.quizMsg.textContent = "Casi… pista: fue el lugar donde empezó todo.";
  }
});

// =====================
// Cápsula
// =====================
els.btnCapsule.addEventListener("click", () => {
  showCapsule();
  hearts(18);
});

// =====================
// Copiar link (si lo subes)
// =====================
els.btnCopy.addEventListener("click", async () => {
  const url = location.href;
  try{
    await navigator.clipboard.writeText(url);
    els.copyMsg.textContent = "Copiado. (Mejor cuando lo subes a un hosting.)";
  }catch{
    els.copyMsg.textContent = "No se pudo copiar en este navegador.";
  }
  setTimeout(() => els.copyMsg.textContent = "", 2500);
});

// =====================
// Init
// =====================
renderNames();
showCapsule();
typewriter(message);
