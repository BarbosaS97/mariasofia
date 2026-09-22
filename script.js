/* ============================================================
   CONVITE DE ANIVERSÁRIO — MARIA SOFIA — TEMA BALLET
   Script principal (JS puro, sem dependências)
   ============================================================ */

/* ------------------------------------------------------------
   CONFIG — todos os dados editáveis do convite ficam aqui.
   Ajuste os valores marcados com "// ← AJUSTAR" antes de enviar
   o convite de verdade.
   ------------------------------------------------------------ */
const CONFIG = {
  aniversariante: "Maria Sofia",
  idade: 7, // ← AJUSTAR

  // Data/hora da festa no formato ISO local (usado na contagem regressiva)
  dataFesta: new Date(2026, 11, 27, 17, 0, 0), // 27/12/2026 às 17h ← AJUSTAR (mês é 0-indexado: 11 = dezembro)
  dataFestaTexto: "27 de dezembro de 2026", // ← AJUSTAR
  horarioTexto: "A partir das 17h", // ← AJUSTAR

  local: "Espaço Villa Uno", // ← AJUSTAR
  endereco: "Endereço a definir — Cidade/UF", // ← AJUSTAR (usado no texto e pode ser usado na busca do mapa)

  dressCode: "Venha de bailarina ou príncipe", // ← AJUSTAR

  // Número de WhatsApp completo, só dígitos, com DDI 55 + DDD + número
  whatsapp: "556193807375", // informado pelo cliente — conferir DDD/dígitos antes de publicar
  mensagemWhatsapp: "Olá! Confirmo presença na festa da Maria Sofia 🩰",

  // Caminho do arquivo de música de fundo (opcional).
  // Se o arquivo não existir, o botão continua funcionando sem quebrar o site.
  musicaSrc: "midias/musica.mp3", // ← AJUSTAR (adicione o arquivo quando disponível)
};

/* ============================================================
   1. CONTAGEM REGRESSIVA
   ============================================================ */
function iniciarContagemRegressiva() {
  const elDias = document.getElementById("cd-dias");
  const elHoras = document.getElementById("cd-horas");
  const elMin = document.getElementById("cd-min");
  const elSeg = document.getElementById("cd-seg");

  if (!elDias || !elHoras || !elMin || !elSeg) return;

  function atualizar() {
    const agora = new Date();
    const diff = CONFIG.dataFesta.getTime() - agora.getTime();

    if (diff <= 0) {
      elDias.textContent = "00";
      elHoras.textContent = "00";
      elMin.textContent = "00";
      elSeg.textContent = "00";
      clearInterval(intervalo);
      return;
    }

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    elDias.textContent = String(dias).padStart(2, "0");
    elHoras.textContent = String(horas).padStart(2, "0");
    elMin.textContent = String(minutos).padStart(2, "0");
    elSeg.textContent = String(segundos).padStart(2, "0");
  }

  atualizar();
  const intervalo = setInterval(atualizar, 1000);
}

/* ============================================================
   2. PREENCHER DADOS DO CONFIG NO HTML
   ============================================================ */
function preencherDados() {
  const mapaTexto = (id, texto) => {
    const el = document.getElementById(id);
    if (el) el.textContent = texto;
  };

  mapaTexto("info-data", CONFIG.dataFestaTexto);
  mapaTexto("info-horario", CONFIG.horarioTexto);
  mapaTexto("info-local", CONFIG.local);
  mapaTexto("info-endereco", CONFIG.endereco);
  mapaTexto("info-dresscode", CONFIG.dressCode);

  // Botão do WhatsApp com mensagem pré-preenchida
  const btnWhatsapp = document.getElementById("whatsappBtn");
  if (btnWhatsapp) {
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensagemWhatsapp)}`;
    btnWhatsapp.setAttribute("href", url);
  }
}

/* ============================================================
   3. ESTRELAS DOURADAS CINTILANDO NO HERO
   ============================================================ */
function gerarEstrelas() {
  const container = document.getElementById("heroStars");
  if (!container) return;

  const prefereReduzirMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const QUANTIDADE = prefereReduzirMovimento ? 0 : 26;

  for (let i = 0; i < QUANTIDADE; i++) {
    const estrela = document.createElement("span");
    estrela.className = "hero__star";

    const tamanho = Math.random() * 3 + 2; // 2px a 5px
    estrela.style.width = `${tamanho}px`;
    estrela.style.height = `${tamanho}px`;
    estrela.style.left = `${Math.random() * 100}%`;
    estrela.style.top = `${Math.random() * 100}%`;
    estrela.style.animationDuration = `${Math.random() * 3 + 2}s`;
    estrela.style.animationDelay = `${Math.random() * 4}s`;

    container.appendChild(estrela);
  }
}

/* ============================================================
   4. SCROLL REVEAL (fade-up suave via Intersection Observer)
   ============================================================ */
function iniciarScrollReveal() {
  const elementos = document.querySelectorAll(".reveal");
  if (!elementos.length) return;

  const prefereReduzirMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefereReduzirMovimento) {
    elementos.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          observer.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  elementos.forEach((el) => observer.observe(el));
}

/* ============================================================
   5. SAPATILHA COM PIROUETTE AO CLICAR
   ============================================================ */
function iniciarPirouette() {
  const sapatilha = document.getElementById("rsvpSapatilha");
  if (!sapatilha) return;

  const prefereReduzirMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  sapatilha.addEventListener("click", () => {
    if (prefereReduzirMovimento) return;
    sapatilha.classList.remove("pirouette");
    // força reflow para permitir reiniciar a animação
    void sapatilha.offsetWidth;
    sapatilha.classList.add("pirouette");
  });

  sapatilha.addEventListener("animationend", () => {
    sapatilha.classList.remove("pirouette");
  });
}

/* ============================================================
   6. MÚSICA DE FUNDO (play/pause + localStorage)
   Fallback silencioso: se o arquivo midias/musica.mp3 não existir,
   o botão continua clicável mas não quebra a página.
   ============================================================ */
function iniciarMusica() {
  const btn = document.getElementById("musicToggle");
  const audio = document.getElementById("bgMusic");
  if (!btn || !audio) return;

  const CHAVE_STORAGE = "mariaSofia_musicaTocando";

  function lerPreferencia() {
    try {
      return localStorage.getItem(CHAVE_STORAGE) === "true";
    } catch (erro) {
      return false;
    }
  }

  function salvarPreferencia(tocando) {
    try {
      localStorage.setItem(CHAVE_STORAGE, String(tocando));
    } catch (erro) {
      /* localStorage indisponível — ignora silenciosamente */
    }
  }

  function atualizarBotao(tocando) {
    btn.classList.toggle("is-playing", tocando);
    btn.setAttribute("aria-pressed", String(tocando));
    btn.setAttribute(
      "aria-label",
      tocando ? "Pausar música de fundo" : "Tocar música de fundo"
    );
  }

  btn.addEventListener("click", () => {
    if (audio.paused) {
      const promessa = audio.play();
      if (promessa && typeof promessa.catch === "function") {
        promessa
          .then(() => {
            atualizarBotao(true);
            salvarPreferencia(true);
          })
          .catch(() => {
            // Arquivo de música ausente ou bloqueio de autoplay:
            // falha de forma silenciosa, sem quebrar a página.
            atualizarBotao(false);
            salvarPreferencia(false);
          });
      } else {
        atualizarBotao(true);
        salvarPreferencia(true);
      }
    } else {
      audio.pause();
      atualizarBotao(false);
      salvarPreferencia(false);
    }
  });

  // Retoma a preferência salva (sem autoplay forçado, navegadores bloqueiam
  // áudio com som sem interação prévia do usuário).
  if (lerPreferencia()) {
    atualizarBotao(false); // mantém desligado até o usuário interagir novamente
  }
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  preencherDados();
  iniciarContagemRegressiva();
  gerarEstrelas();
  iniciarScrollReveal();
  iniciarPirouette();
  iniciarMusica();
});
