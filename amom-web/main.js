const CONFIG = {
  sedes: {
    santafe: {
      nombre: "Santa Fe",
      direccion: "9 de Julio 2898, Santa Fe Capital",
      whatsappE164: "", // TODO: completar (ej: 549342XXXXXXX)
      instagram: "https://www.instagram.com/amom.mutual_/"
    },
    chubut: {
      nombre: "Chubut",
      direccion: "San Martín 1061 Local 1, Chubut",
      whatsappE164: "5492804659408",
      instagram: "https://www.instagram.com/mutual.amom.chubut/"
    },
    sanjuan: {
      nombre: "San Juan",
      direccion: "San Juan (sede provincial)",
      whatsappE164: "5492645156981",
      instagram: "https://www.instagram.com/mutual.amom.sanjuan/"
    }
  },
  defaultSede: "chubut" // cambiá a "santafe" si querés
};

function onlyDigits(v){ return (v || "").toString().replace(/\D/g,""); }
function formatMoneyARS(v){
  const n = Number(onlyDigits(v));
  if (!Number.isFinite(n) || n <= 0) return "";
  return n.toLocaleString("es-AR");
}
function waLink(e164, text){
  const num = onlyDigits(e164);
  if (!num) return "#";
  return `https://wa.me/${num}?text=${encodeURIComponent(text || "")}`;
}

function renderContactBox() {
  const box = document.getElementById("contactBox");
  if (!box) return;

  const entries = Object.values(CONFIG.sedes).map(s => {
    const ok = !!onlyDigits(s.whatsappE164);
    const wa = ok ? `+${s.whatsappE164}` : "(WhatsApp pendiente de configurar)";
    return `
      <div>
        <strong style="color:rgba(255,255,255,.92)">${s.nombre}</strong><br/>
        <span>${s.direccion}</span><br/>
        <span>WhatsApp: ${wa}</span><br/>
        <a style="color:rgba(255,255,255,.75);font-weight:800" href="${s.instagram}" target="_blank" rel="noopener">Instagram</a>
      </div>
    `;
  }).join("");

  box.innerHTML = entries;
}

function setWhatsAppTargets(sedeKey) {
  const sede = CONFIG.sedes[sedeKey] || CONFIG.sedes[CONFIG.defaultSede];
  const baseMsg = `Hola AMOM Mutual (${sede.nombre}). Quiero información para solicitar un crédito.`;

  const href = waLink(sede.whatsappE164, baseMsg);
  const ids = ["waFloat", "waMini"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.href = href;
    el.title = (href === "#") ? `Falta configurar WhatsApp de ${sede.nombre} en main.js` : `WhatsApp ${sede.nombre}`;
  });
}

function bindForm() {
  const form = document.getElementById("leadForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const sedeKey = document.getElementById("sedeSelect")?.value || CONFIG.defaultSede;
    const sede = CONFIG.sedes[sedeKey] || CONFIG.sedes[CONFIG.defaultSede];

    const nombre = (document.getElementById("nombre")?.value || "").trim();
    const dni = onlyDigits(document.getElementById("dni")?.value);
    const tel = (document.getElementById("telefono")?.value || "").trim();
    const monto = formatMoneyARS(document.getElementById("monto")?.value);
    const cuotas = (document.getElementById("cuotas")?.value || "").trim();

    const msg = [
      `Hola AMOM Mutual (${sede.nombre}). Quiero solicitar un crédito.`,
      `Nombre: ${nombre}`,
      dni ? `DNI: ${dni}` : null,
      tel ? `Mi WhatsApp: ${tel}` : null,
      monto ? `Monto estimado: $${monto}` : null,
      cuotas ? `Cuotas: ${cuotas}` : null,
      `¿Qué requisitos necesito para avanzar?`
    ].filter(Boolean).join("\n");

    const href = waLink(sede.whatsappE164, msg);
    if (href === "#") {
      alert(`Falta configurar el WhatsApp oficial de ${sede.nombre} en main.js`);
      return;
    }
    window.open(href, "_blank", "noopener");
  });
}

function bindMenu() {
  const toggle = document.getElementById("navToggle");
  const mobile = document.getElementById("navMobile");
  if (!toggle || !mobile) return;

  toggle.addEventListener("click", () => {
    const isOpen = mobile.style.display === "block";
    mobile.style.display = isOpen ? "none" : "block";
  });

  mobile.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobile.style.display = "none";
    });
  });
}

function init() {
  document.getElementById("year").textContent = new Date().getFullYear();

  const sedeSelect = document.getElementById("sedeSelect");
  if (sedeSelect) sedeSelect.value = CONFIG.defaultSede;

  setWhatsAppTargets(CONFIG.defaultSede);
  renderContactBox();
  bindForm();
  bindMenu();

  sedeSelect?.addEventListener("change", (e) => {
    setWhatsAppTargets(e.target.value);
  });
}

init();
