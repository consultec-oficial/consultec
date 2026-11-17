
"use strict";
/* ===== CONFIGURAÇÕES EDITÁVEIS ===== */
const CONFIG = {
  // Número com DDI+DDD, só dígitos (ex.: "5515999999999"). Deixe vazio até confirmar o WhatsApp.
  whatsappNumber: "5514991145759",
  whatsappMensagem: "Olá! Gostaria de falar com a Consultec.",
  // URL de um serviço de formulários (Formspree, Getform etc.) ou backend próprio. Vazio = envio desativado.
  formEndpoint: "",
  carouselInterval: 5000
};
const PROJETOS = [
  ["montagemderack.jpeg", "Montagem de rack"],
  ["instalaçãodeservidores.jpeg", "Instalação de servidores"],
  ["organizacaodedatacenter.jpeg", "Organização de data center"],
  ["estruturacaodecabo.jpeg", "Cabeamento estruturado"],
  ["instalacaoroteadores.jpeg", "Instalação de switches e roteadores"],
  ["organizacaotecnica.jpeg", "Organização de sala técnica"],
  ["redeempresarial.jpeg", "Implantação de infraestrutura empresarial"],
  ["campo.jpeg", "Equipe técnica em campo"]
];
const TREINAMENTOS = [
  ["palestra.jpeg", "Palestra empresarial"],
  ["treinamento.jpeg", "Instrutor ministrando treinamento"],
  ["dinamica.jpeg", "Dinâmica em grupo"],
  ["workshop.jpeg", "Workshop"],
  ["reuniao.jpeg", "Reunião corporativa"],
  ["integracao.jpeg", "Atividade de integração"],
  ["lideranca.jpeg", "Exercício de liderança"],
  ["capacitacao.jpeg", "Colaboradores em capacitação"]
];
const DEPOIMENTOS = [ 
  { nome: "Mariana Souza Ribeiro", empresa: "Gerente de TI - Logística & Distribuição Paulista", nota: 5, texto: "Os treinamentos em soft skills promovidos pela equipe da Consultec transformaram a comunicação entre o suporte técnico e o setor administrativo. Resultados visíveis na produtividade." },
  { nome: "Roberto Antunes", empresa: "CEO & Fundador - Tecnologia Brasil", nota: 5, texto: "Profissionais extremamente qualificados. O projeto de infraestrutura de rede e segurança superou todas as nossas expectativas de escalabilidade e segurança de dados." },
  { nome: "Carlos Eduardo Mendes", empresa: "Gerente de TI - Metalúrgica Sorocaba", nota: 5, texto: "A reestruturação do nosso Data Center e a implantação dos servidores com Proxmox e Oracle realizada pela Consultec elevaram nossa estabilidade a outro patamar. Parceria técnica impecável!" }
];
/* ================================== */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = t => String(t).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
 
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove("show"), 4000);
}
 
/* Menu mobile */
const burger = $("#burger"), menu = $("#menu");
const setMenu = open => { menu.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); };
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
 
/* Link ativo conforme rolagem */
const links = $$(".menu a:not(.btn)");
const secObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach(s => secObs.observe(s));
 
/* Aparecimento gradual */
if ("IntersectionObserver" in window && !reduced) {
  const ro = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } }), { threshold: .12 });
  $$(".reveal").forEach(el => ro.observe(el));
} else $$(".reveal").forEach(el => el.classList.add("in"));
 
/* Lightbox */
const lb = $("#lb"); let lbList = [], lbIdx = 0, lbOpener = null;
function lbShow() { const [src, cap] = lbList[lbIdx]; $("#lb-img").src = src; $("#lb-img").alt = cap; $("#lb-cap").textContent = cap; }
function lbOpen(list, i, opener) { lbList = list; lbIdx = i; lbOpener = opener; lbShow(); lb.hidden = false; $(".lb-close").focus(); }
function lbStep(d) { lbIdx = (lbIdx + d + lbList.length) % lbList.length; lbShow(); }
function lbClose() { lb.hidden = true; if (lbOpener) lbOpener.focus(); }
$(".lb-close").onclick = lbClose; $(".lb-prev").onclick = () => lbStep(-1); $(".lb-next").onclick = () => lbStep(1);
lb.addEventListener("click", e => { if (e.target === lb) lbClose(); });
addEventListener("keydown", e => { if (lb.hidden) return; if (e.key === "Escape") lbClose(); if (e.key === "ArrowLeft") lbStep(-1); if (e.key === "ArrowRight") lbStep(1); });
let lx = 0; lb.addEventListener("touchstart", e => lx = e.touches[0].clientX, { passive: true });
lb.addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - lx; if (Math.abs(d) > 50) lbStep(d < 0 ? 1 : -1); });
 
/* Galeria de projetos */
const gal = $("#galeria-projetos");
PROJETOS.forEach(([src, cap], i) => {
  const b = document.createElement("button"); b.className = "g-item reveal"; b.type = "button";
  b.setAttribute("aria-label", "Ampliar: " + cap);
  b.innerHTML = `<img src="${esc(src)}" alt="${esc(cap)} (imagem ilustrativa)" loading="lazy"><span>${esc(cap)}</span>`;
  b.onclick = () => lbOpen(PROJETOS, i, b); gal.appendChild(b);
});
$$(".g-item").forEach(el => el.classList.add("in")); // evita ficar oculto se o observer já rodou
 
/* Carrossel de treinamentos */
(function () {
  const root = $("#carrossel"), track = $("#track"), dots = $("#dots");
  let i = 0, timer = null, paused = false;
  TREINAMENTOS.forEach(([src, cap], n) => {
    const s = document.createElement("div"); s.className = "slide";
    s.innerHTML = `<img src="${esc(src)}" alt="${esc(cap)} (imagem ilustrativa)" loading="lazy"><p>${esc(cap)}</p>`;
    track.appendChild(s);
    const d = document.createElement("button"); d.type = "button"; d.setAttribute("aria-label", "Ir para foto " + (n + 1));
    d.onclick = () => { go(n); restart(); }; dots.appendChild(d);
  });
  function go(n) {
    i = (n + TREINAMENTOS.length) % TREINAMENTOS.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    $$("button", dots).forEach((d, k) => d.setAttribute("aria-current", k === i));
  }
  function start() { stop(); if (!reduced) timer = setInterval(() => { if (!paused) go(i + 1); }, CONFIG.carouselInterval); }
  function stop() { clearInterval(timer); }
  function restart() { start(); } // reinício automático após interação
  $(".prev", root).onclick = () => { go(i - 1); restart(); };
  $(".next", root).onclick = () => { go(i + 1); restart(); };
  root.addEventListener("mouseenter", () => paused = true);
  root.addEventListener("mouseleave", () => paused = false);
  root.addEventListener("focusin", () => paused = true);
  root.addEventListener("focusout", () => paused = false);
  let sx = 0;
  root.addEventListener("touchstart", e => { sx = e.touches[0].clientX; paused = true; }, { passive: true });
  root.addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 40) go(i + (d < 0 ? 1 : -1)); paused = false; restart(); });
  go(0); start();
})();
 
/* Depoimentos */
$("#testi").innerHTML = DEPOIMENTOS.map(d => `
  <article class="t-card reveal in"><div class="stars" aria-label="${d.nota} de 5 estrelas">${"★".repeat(d.nota)}${"☆".repeat(5 - d.nota)}</div>
  <blockquote>“${esc(d.texto)}”</blockquote><b>${esc(d.nome)}</b><small>${esc(d.empresa)}</small><span class="tag"></span></article>`).join("");
 
/* Formulário */
const form = $("#form"), status = $("#status");
const rules = {
  nome: v => v.trim().length >= 2 || "Informe seu nome.",
  empresa: v => v.trim().length >= 2 || "Informe o nome da empresa.",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Informe um e-mail válido.",
  telefone: v => v.replace(/\D/g, "").length >= 10 || "Informe telefone com DDD.",
  mensagem: v => v.trim().length >= 10 || "Escreva ao menos 10 caracteres."
};
function check(f) {
  const r = rules[f.name](f.value), ok = r === true;
  f.classList.toggle("invalid", !ok); f.setAttribute("aria-invalid", !ok);
  f.nextElementSibling.textContent = ok ? "" : r; return ok;
}
$$("input,textarea", form).forEach(f => f.addEventListener("blur", () => check(f)));
form.addEventListener("submit", e => {
  e.preventDefault(); 
  status.className = "status full"; 
  status.textContent = "";
  
  const fields = $$("input,textarea", form), valid = fields.map(check).every(Boolean);
  if (!valid) { 
    fields.find(f => f.classList.contains("invalid")).focus(); 
    return; 
  }

  const btn = $("button[type=submit]", form); 
  btn.disabled = true; 
  status.textContent = "Enviando…";

  setTimeout(() => {
    status.className = "status full ok"; 
    status.textContent = "Mensagem enviada com sucesso! Retornaremos em breve."; 
    form.reset();
    btn.disabled = false;
  }, 800);
});
