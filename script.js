/* ============================================================
   CONVITE DE ANIVERSÁRIO — MARIA SOFIA — TEMA BALLET
   Script principal (JS puro, sem dependências)
   ============================================================ */

/** Abra o link com "?demo" no final (ex.: ...index.html?demo) para mostrar este convite
 *  como exemplo de portfólio: some o endereço e desliga "Confirmar no WhatsApp".
 *  O link normal (sem "?demo"), já enviado aos convidados, continua funcionando igual. */
const MODO_DEMO = /[?&]demo(?:=1)?(?:&|$)/i.test(location.search);

/* ------------------------------------------------------------
   CONFIG — todos os dados editáveis do convite ficam aqui.
   Ajuste os valores marcados com "// ← AJUSTAR" antes de enviar
   o convite de verdade.
   ------------------------------------------------------------ */
const CONFIG = {
  aniversariante: "Maria Sofia",
  idade: 3,

  // Data/hora da festa no formato ISO local (usado na contagem regressiva)
  dataFesta: new Date(2026, 11, 27, 17, 0, 0), // 27/12/2026 às 17h ← AJUSTAR (mês é 0-indexado: 11 = dezembro)
  dataFestaTexto: "27 de dezembro de 2026", // ← AJUSTAR
  horarioTexto: "A partir das 17h", // ← AJUSTAR

  local: "Espaço Villa Uno I Casa de Festa Infantil", // confirmado pelo link do Google Maps
  endereco: "St. Hab. Vicente Pires, Lote 36, Loja 08 - Taguatinga, Brasília - DF, 72005-100",

  // Número de WhatsApp completo, só dígitos, com DDI 55 + DDD + número
  whatsapp: "556193807375", // informado pelo cliente — conferir DDD/dígitos antes de publicar
  mensagemWhatsapp: "Olá! Confirmo presença na festa da Maria Sofia 🩰",

  // Caminho do arquivo de música de fundo (opcional).
  // Se o arquivo não existir, o botão continua funcionando sem quebrar o site.
  musicaSrc: "midias/musica.mp3",
  musicaInicioSegundos: 30, // a faixa começa (e reinicia, no loop) a partir deste ponto
  musicaFimSegundos: 122, // ~2:02 — corta antes da fala no final da faixa (2:12) ← AJUSTAR se ainda pegar a fala
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
  mapaTexto(
    "info-endereco",
    MODO_DEMO ? "Endereço disponível para convidados confirmados" : CONFIG.endereco
  );

  // Idade aparece tanto na capa quanto na abertura do convite
  const textoIdade = `${CONFIG.idade} ${CONFIG.idade === 1 ? "aninho" : "aninhos"} de puro encanto`;
  mapaTexto("capa-idade", textoIdade);
  mapaTexto("convite-idade", textoIdade);

  // Botão do WhatsApp com mensagem pré-preenchida
  const btnWhatsapp = document.getElementById("whatsappBtn");
  if (btnWhatsapp) {
    if (MODO_DEMO) {
      btnWhatsapp.setAttribute("href", "#");
      btnWhatsapp.addEventListener("click", (evento) => {
        evento.preventDefault();
        mostrarAviso("Este é um convite de exemplo. Fale com a gente para criar o seu!");
      });
    } else {
      const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensagemWhatsapp)}`;
      btnWhatsapp.setAttribute("href", url);
    }
  }
}

/** Aviso rápido (toast) usado só no modo demo — sem depender de nenhum elemento extra no HTML. */
let avisoTimer;
function mostrarAviso(texto) {
  let el = document.getElementById("demoAviso");
  if (!el) {
    el = document.createElement("div");
    el.id = "demoAviso";
    el.setAttribute("role", "alert");
    el.style.cssText =
      "position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:9999;" +
      "max-width:90vw;padding:12px 20px;border-radius:999px;text-align:center;" +
      "background:#16303A;color:#fff;font:600 14px/1.4 system-ui,sans-serif;" +
      "box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;transition:opacity .25s ease;pointer-events:none";
    document.body.appendChild(el);
  }
  el.textContent = texto;
  el.style.opacity = "1";
  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => { el.style.opacity = "0"; }, 3200);
}

/* ============================================================
   3. ESTRELAS DOURADAS CINTILANDO (capa e abertura do convite)
   ============================================================ */
function gerarEstrelas(container) {
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
   Retorna controles reaproveitados pelo botão "Abrir Convite",
   que dispara a música automaticamente (dentro do próprio clique
   do usuário, para respeitar a política de autoplay dos navegadores).
   ============================================================ */
function iniciarMusica() {
  const btn = document.getElementById("musicToggle");
  const audio = document.getElementById("bgMusic");
  if (!btn || !audio) return null;

  const CHAVE_STORAGE = "mariaSofia_musicaTocando";

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

  function tocar() {
    if (audio.currentTime < CONFIG.musicaInicioSegundos) {
      audio.currentTime = CONFIG.musicaInicioSegundos;
    }
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
  }

  function pausar() {
    audio.pause();
    atualizarBotao(false);
    salvarPreferencia(false);
  }

  // Corta a faixa antes do trecho falado no final: assim que chega perto do
  // fim configurado, volta direto para o ponto de início (sem precisar
  // editar o arquivo de áudio).
  audio.addEventListener("timeupdate", () => {
    if (audio.currentTime >= CONFIG.musicaFimSegundos) {
      audio.currentTime = CONFIG.musicaInicioSegundos;
    }
  });

  // Loop manual: ao chegar no fim da faixa, volta para o ponto de início
  // (em vez de reiniciar do zero, como faria o atributo "loop" nativo).
  // Fica como rede de segurança, caso o corte acima não seja atingido a tempo.
  audio.addEventListener("ended", () => {
    audio.currentTime = CONFIG.musicaInicioSegundos;
    audio.play().catch(() => {
      atualizarBotao(false);
      salvarPreferencia(false);
    });
  });

  btn.addEventListener("click", () => {
    if (audio.paused) {
      tocar();
    } else {
      pausar();
    }
  });

  return { tocar, pausar };
}

/* ============================================================
   7. ABRIR CONVITE
   A capa é uma camada fixa em tela cheia (ver CSS: .hero {position:
   fixed}), então ela nunca ocupa espaço na página — ao sumir, some
   de verdade, sem deixar "sobra" de rolagem. O convite fica por
   baixo dela o tempo todo, revelado assim que a capa desaparece.
   A música é iniciada de forma síncrona dentro do próprio clique,
   que é o gesto exigido pelos navegadores para autoplay com som.
   ============================================================ */
function iniciarAberturaConvite(musica) {
  const btn = document.getElementById("abrirConviteBtn");
  const capa = document.getElementById("capa");
  const convite = document.getElementById("convite");
  if (!btn || !convite) return;

  const DURACAO_FADE_MS = 650; // precisa bater com a transição de .hero.is-saindo no CSS

  btn.addEventListener("click", () => {
    if (musica) {
      musica.tocar();
    }

    convite.hidden = false;
    requestAnimationFrame(() => {
      convite.classList.add("is-visible");
    });

    if (capa) {
      // Some com um leve esmaecer (a capa é fixa, então isso não afeta
      // a altura/rolagem da página em nenhum momento da transição).
      capa.classList.add("is-saindo");
      window.setTimeout(() => {
        capa.hidden = true;
      }, DURACAO_FADE_MS);
    }
  });
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  preencherDados();
  iniciarContagemRegressiva();
  gerarEstrelas(document.getElementById("capaStars"));
  gerarEstrelas(document.getElementById("conviteStars"));
  iniciarScrollReveal();
  iniciarPirouette();
  const musica = iniciarMusica();
  iniciarAberturaConvite(musica);
});
