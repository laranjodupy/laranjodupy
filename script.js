// =====================================================
// FADE-IN DAS SEÇÕES (igual ao original)
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const section_animados = document.querySelectorAll('.fade-section');

    const elementos_na_visao = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
            } else {
                entrada.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    });
    section_animados.forEach(el => elementos_na_visao.observe(el));
});

// =====================================================
// BARRINHA DE CONHECIMENTO — "anda" até o nível quando o
// card fica visível na tela (estilo barra de vida enchendo).
// Cada .pixel recebe um índice (--i) usado pelo CSS como
// delay de transição, então eles acendem em sequência da
// esquerda pra direita até o nível definido em --conhecimento.
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const cards_habilidade = document.querySelectorAll('.card-habilidade');

    cards_habilidade.forEach(card => {
        const pixels = card.querySelectorAll('.pixel');
        pixels.forEach((pixel, indice) => {
            pixel.style.setProperty('--i', indice);
        });
    });

    const observer_barrinhas = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            const barrinha = entrada.target.querySelector('.barrinha-conhecimento');
            if (!barrinha) return;

            if (entrada.isIntersecting) {
                barrinha.classList.add('barrinha-ativa');
            } else {
                // sai da tela: reseta pra animar de novo da próxima vez que aparecer
                barrinha.classList.remove('barrinha-ativa');
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -40px 0px'
    });

    cards_habilidade.forEach(card => observer_barrinhas.observe(card));
});

// =====================================================
// MODAL DE PROJETOS — clique num card de Hard-Skill abre um
// pop-up listando projetos feitos com aquela tecnologia.
//
// COMO ADICIONAR/EDITAR PROJETOS:
// Edite o objeto PROJETOS_POR_HABILIDADE abaixo. A chave tem
// que ser igual ao "id" do card no HTML (ex: id="python_card").
// Cada projeto aceita: nome, descricao, link (texto do botão
// e URL). Se um card não tiver projetos ainda, deixe a lista
// vazia [] — o modal mostra uma mensagem de "em breve".
// =====================================================
const PROJETOS_POR_HABILIDADE = {
    'python_card': [
        {
            nome: 'LaranBot — Boilerplate de ChatBot pro Telegram',
            descricao: 'Template de chatbot rodando em Cloudflare Workers com Python + FastAPI (ponte ASGI). Webhook do Telegram, comandos com botões inline, banco D1 versionado por migrations, e IA rodando direto na infraestrutura da Cloudflare (Workers AI), sem chave externa. README tutorial completo, do zero ao deploy.',
            linkTexto: 'Ver no GitHub',
            linkUrl: 'https://github.com/laranjodupy/LaranBotDev_Telegram'
        }
    ],
    // C++ e C: só estudo até agora, sem projeto público — fica vazio de
    // propósito (nada de forçar um projeto que não existe).
    'card-cpp': [],
    'card-c': [],
    // No-code/Low-code: você comentou que pretende postar algo em breve.
    'card-nocode': [],
    'card-html': [
        {
            nome: 'Esse mesmo portfólio',
            descricao: 'O site que você tá vendo agora — HTML e CSS puro, sem framework, com sistema de temas, bordas pixeladas e responsividade escritos do zero.',
            linkTexto: 'Ver no GitHub',
            linkUrl: 'https://github.com/laranjodupy/DanielV_PortfolioWeb'
        }
    ],
    'card-js': [
        {
            nome: 'StalkerDeAluno — Sistema de Cadastro de Alunos',
            descricao: 'Full-stack (Node/Express + React/Vite) com CRUD completo e 6 tipos de validação no backend. Projeto em equipe (ZanixCold), na Jovem Tech.',
            linkTexto: 'Ver no GitHub',
            linkUrl: 'https://github.com/laranjodupy/stalkerdeAluno_JovemTech'
        },
        {
            nome: 'Esse mesmo portfólio',
            descricao: 'Partículas em canvas, observer de scroll, sistema de temas e o modal que você tá lendo agora mesmo — tudo em JS puro.',
            linkTexto: 'Ver no GitHub',
            linkUrl: 'https://github.com/laranjodupy/DanielV_PortfolioWeb'
        }
    ],
    'card-git': [
        {
            nome: 'StalkerDeAluno',
            descricao: 'Histórico de commits organizado, branches e um README bem documentado — a base de tudo que sei de controle de versão até aqui.',
            linkTexto: 'Ver repositório',
            linkUrl: 'https://github.com/laranjodupy/stalkerdeAluno_JovemTech'
        }
    ],
    'card-react': [
        {
            nome: 'StalkerDeAluno — Dashboard em React',
            descricao: 'Frontend em React + Vite com React Router, hook customizado centralizando a comunicação com a API, e uma página de estatísticas com pódio e gráfico de barras.',
            linkTexto: 'Ver no GitHub',
            linkUrl: 'https://github.com/laranjodupy/stalkerdeAluno_JovemTech'
        }
    ],
    'card-supabase': [],
    'card-postgres': [
        {
            nome: 'LojaRapida — Banco de Dados',
            descricao: 'Banco relacional em PL/pgSQL: schema, seed, views, transactions e queries. Projeto de modelagem e manipulação de dados na Jovem Tech.',
            linkTexto: 'Ver no GitHub',
            linkUrl: 'https://github.com/laranjodupy/Projeto_LojaRapida_JovemTech'
        }
    ],
    // O mesmo projeto do card de Python, mas com a descrição focada
    // na parte de infraestrutura/deploy — é o que esse card representa.
    'card-cloudflare': [
        {
            nome: 'LaranBot — Deploy Serverless',
            descricao: 'Worker em Python via wrangler, com bindings de D1 (banco) e Workers AI configurados no wrangler.jsonc. Fluxo separado de dev local (banco local, sem exposição pública) e deploy remoto (secret de produção, migration remota, webhook do Telegram apontando pra URL final).',
            linkTexto: 'Ver no GitHub',
            linkUrl: 'https://github.com/laranjodupy/LaranBotDev_Telegram'
        }
    ],
    'card-csharp': []
};

document.addEventListener('DOMContentLoaded', () => {
    const cards_habilidade = document.querySelectorAll('.card-habilidade');

    // acessibilidade: cards viram "botões" navegáveis por teclado
    cards_habilidade.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        const nomeTech = card.querySelector('h3')?.textContent || 'habilidade';
        card.setAttribute('aria-label', 'Ver projetos de ' + nomeTech);
    });

    function abrirModalProjetos(card) {
        const nomeTech = card.querySelector('h3')?.textContent || '';
        const icone = card.querySelector('.icone')?.textContent || '';
        const corTech = getComputedStyle(card).getPropertyValue('--marcha-cor');
        const projetos = PROJETOS_POR_HABILIDADE[card.id] || [];

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        const caixa = document.createElement('div');
        caixa.className = 'modal-caixa pixel-frame';
        caixa.style.setProperty('--marcha-cor', corTech);

        let projetosHtml = '';
        if (projetos.length === 0) {
            projetosHtml = '<p class="modal-sem-projetos">Ainda não adicionei projetos aqui — em breve!</p>';
        } else {
            projetosHtml = projetos.map(p => `
                <div class="modal-projeto">
                    <p class="modal-projeto-nome">&gt; ${p.nome}</p>
                    <p class="modal-projeto-desc">${p.descricao}</p>
                    <a href="${p.linkUrl}" class="modal-projeto-link" target="_blank" rel="noopener noreferrer">${p.linkTexto} ↗</a>
                </div>
            `).join('');
        }

        caixa.innerHTML = `
            <button class="modal-fechar" aria-label="Fechar">X</button>
            <div class="modal-cabecalho">
                <span class="modal-icone">${icone}</span>
                <h3 class="modal-titulo">${nomeTech}</h3>
            </div>
            <p class="modal-subtitulo">Projetos feitos com essa tecnologia</p>
            ${projetosHtml}
        `;

        overlay.appendChild(caixa);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        function fecharModal() {
            overlay.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', aoApertarEsc);
            card.focus();
        }

        function aoApertarEsc(e) {
            if (e.key === 'Escape') fecharModal();
        }

        caixa.querySelector('.modal-fechar').addEventListener('click', fecharModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) fecharModal(); });
        document.addEventListener('keydown', aoApertarEsc);

        // foco vai pro botão de fechar, pra navegação por teclado começar num lugar previsível
        caixa.querySelector('.modal-fechar').focus();
    }

    cards_habilidade.forEach(card => {
        card.addEventListener('click', () => abrirModalProjetos(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                abrirModalProjetos(card);
            }
        });
    });
});

// =====================================================
// LIGHTBOX DE CERTIFICADOS — clique num card de certificado
// abre a imagem em tamanho completo + legenda explicando o
// que ele cobre. Mesmo padrão visual/acessibilidade do modal
// de projetos (overlay, Esc pra fechar, foco no botão fechar).
//
// COMO ADICIONAR UM CERTIFICADO NOVO:
// 1. Solte o arquivo em componentes/certificados/
// 2. Adicione um .card-certificado no HTML com data-cert="algumId"
// 3. Descreva ele aqui embaixo, usando a mesma chave "algumId"
// =====================================================
const LEGENDAS_CERTIFICADOS = {
    'ds': {
        titulo: 'Data Science Essentials with Python',
        emissor: 'Cisco Networking Academy',
        legenda: 'Curso focado em manipulação de dados com Python: importar bibliotecas, ler CSV em DataFrames, usar eval(), query() e groupby(), fazer merges, limpar dados (colunas, valores ausentes, tipos), gerar gráficos com Matplotlib e entender o básico de regressão linear e teste de hipóteses.',
        original: 'componentes/Certificado_DS_Essentials_Daniel.pdf',
        tipo: 'pdf'
    },
    'i2cs': {
        titulo: 'Introduction to Cybersecurity',
        emissor: 'Cisco Networking Academy',
        legenda: 'Introdução aos fundamentos de segurança da informação: principais ameaças, ataques e vulnerabilidades, como se proteger online, como organizações se defendem, e um panorama das carreiras da área.',
        original: 'componentes/I2CS_Daniel.pdf',
        tipo: 'pdf'
    },
    'jovemtech': {
        titulo: 'Desenvolvedor Júnior Full Stack',
        emissor: 'Instituto de Inovação de Sergipe · Programa Jovem Tech',
        legenda: 'Formação completa em desenvolvimento full stack pelo programa Jovem Tech (parceria com o Governo Federal e a Prefeitura de Aracaju), de onde saíram os projetos StalkerDeAluno e LojaRapida listados nas hard-skills acima.',
        original: 'componentes/Certificado_Jovem_tech.jpeg',
        tipo: 'imagem'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const cards_certificado = document.querySelectorAll('.card-certificado');

    cards_certificado.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        const titulo = card.querySelector('h3')?.textContent || 'certificado';
        card.setAttribute('aria-label', 'Ver certificado: ' + titulo + ' em tamanho completo');
    });

    function abrirLightboxCertificado(card) {
        const chave = card.dataset.cert;
        const dados = LEGENDAS_CERTIFICADOS[chave];
        const imgSrc = card.querySelector('.certificado-thumb')?.getAttribute('src');
        if (!dados || !imgSrc) return;

        const rotuloVer = dados.tipo === 'pdf' ? 'Ver PDF original' : 'Ver imagem original';
        const rotuloBaixar = dados.tipo === 'pdf' ? 'Baixar PDF' : 'Baixar imagem';

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        const caixa = document.createElement('div');
        caixa.className = 'modal-caixa modal-caixa-certificado pixel-frame';

        caixa.innerHTML = `
            <button class="modal-fechar" aria-label="Fechar">X</button>
            <img src="${imgSrc}" alt="${dados.titulo}" class="modal-cert-imagem">
            <div class="modal-cabecalho">
                <h3 class="modal-titulo">${dados.titulo}</h3>
            </div>
            <p class="modal-subtitulo">${dados.emissor}</p>
            <p class="modal-cert-legenda">${dados.legenda}</p>
            <div class="modal-cert-acoes">
                <a href="${dados.original}" target="_blank" rel="noopener noreferrer" class="modal-projeto-link">${rotuloVer} ↗</a>
                <a href="${dados.original}" download class="modal-projeto-link">${rotuloBaixar} ⬇</a>
            </div>
        `;

        overlay.appendChild(caixa);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        function fecharModal() {
            overlay.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', aoApertarEsc);
            card.focus();
        }

        function aoApertarEsc(e) {
            if (e.key === 'Escape') fecharModal();
        }

        caixa.querySelector('.modal-fechar').addEventListener('click', fecharModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) fecharModal(); });
        document.addEventListener('keydown', aoApertarEsc);

        caixa.querySelector('.modal-fechar').focus();
    }

    cards_certificado.forEach(card => {
        card.addEventListener('click', () => abrirLightboxCertificado(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                abrirLightboxCertificado(card);
            }
        });
    });
});

// =====================================================
// TEMA (escuro / retrô) — persiste em localStorage
// O <head> já aplica o tema salvo antes do CSS pintar
// (evita o "flash" do tema errado), aqui é só o toggle.
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const btnTema = document.getElementById('btn-tema');
    const label = document.getElementById('tema-toggle-label');
    const html = document.documentElement;

    function atualizarLabel() {
        const atual = html.getAttribute('data-tema') || 'escuro';
        label.textContent = atual === 'escuro' ? 'CINZA' : 'ESCURO';
    }
    atualizarLabel();

    btnTema.addEventListener('click', () => {
        const atual = html.getAttribute('data-tema') || 'escuro';
        const novo = atual === 'escuro' ? 'retro' : 'escuro';
        html.setAttribute('data-tema', novo);
        try { localStorage.setItem('tema', novo); } catch (e) { /* modo privado, sem problema */ }
        atualizarLabel();
        if (window.__atualizarCoresParticulas) window.__atualizarCoresParticulas();
    });
});

// =====================================================
// BOTÃO DE FECHAR — easter egg (não fecha nada de verdade,
// navegador não deixa script fechar aba que ele não abriu,
// então a gente brinca com isso em vez de fingir que funciona)
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const btnFechar = document.getElementById('btn-fechar');
    if (!btnFechar) return;

    btnFechar.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;font-family:"Space Mono",monospace;';

        const caixa = document.createElement('div');
        caixa.style.cssText = 'background:#1c1c1c;color:#e6e6e6;border:3px solid #000;box-shadow:5px 5px 0 #000;padding:1.5rem;max-width:280px;text-align:center;';
        caixa.innerHTML = '<p style="font-family:\'Silkscreen\',monospace;font-size:0.85rem;color:#FFD43B;margin-bottom:0.8rem;">&lt;system&gt;</p><p style="font-size:0.8rem;margin-bottom:1.2rem;">Esse botão é só decoração da janela retrô — mas já que clicou, que tal dar uma olhada no GitHub em vez de fechar?</p>';

        const botoes = document.createElement('div');
        botoes.style.cssText = 'display:flex;gap:0.6rem;justify-content:center;';

        const btnOk = document.createElement('button');
        btnOk.textContent = 'Beleza';
        btnOk.style.cssText = 'font-family:"Silkscreen",monospace;font-size:0.7rem;background:#FFD43B;color:#111;border:2px solid #000;padding:6px 12px;cursor:pointer;';
        btnOk.addEventListener('click', () => overlay.remove());

        botoes.appendChild(btnOk);
        caixa.appendChild(botoes);
        overlay.appendChild(caixa);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    });
});

// =====================================================
// BOOT SCREEN — só na primeira visita da sessão, pulável
// a qualquer momento com clique ou tecla, e desativado se
// a pessoa pediu "reduzir movimento" no sistema dela.
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let jaViu = false;
    try { jaViu = sessionStorage.getItem('boot_visto') === '1'; } catch (e) { jaViu = false; }

    if (reduzMovimento || jaViu) return;

    const linhas = [
        '&gt; carregando portfolio.py ...',
        '&gt; importando habilidades ...',
        '&gt; compilando personalidade ...',
        '&gt; boot concluido.'
    ];

    const boot = document.createElement('div');
    boot.id = 'boot-screen';

    linhas.forEach((texto, i) => {
        const p = document.createElement('p');
        p.className = 'boot-linha';
        p.style.animationDelay = (i * 0.35) + 's';
        p.innerHTML = texto;
        boot.appendChild(p);
    });

    const barraWrap = document.createElement('div');
    barraWrap.className = 'boot-barra-wrap';
    const barra = document.createElement('div');
    barra.className = 'boot-barra';
    barraWrap.appendChild(barra);
    boot.appendChild(barraWrap);

    const dica = document.createElement('p');
    dica.className = 'boot-dica';
    dica.textContent = 'clique ou aperte qualquer tecla pra pular';
    boot.appendChild(dica);

    document.body.appendChild(boot);

    function encerrarBoot() {
        if (!boot.isConnected) return;
        boot.classList.add('boot-saindo');
        try { sessionStorage.setItem('boot_visto', '1'); } catch (e) { /* sem problema */ }
        setTimeout(() => boot.remove(), 300);
        document.removeEventListener('keydown', encerrarBoot);
    }

    boot.addEventListener('click', encerrarBoot);
    document.addEventListener('keydown', encerrarBoot);
    setTimeout(encerrarBoot, 2400);
});

// =====================================================
// BACKGROUND DE PARTÍCULAS (igual ao original, mas as
// cores reagem à troca de tema em tempo real)
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    const paletas = {
        escuro: { pontos: ['#306998', '#FFD43B', '#9CA3AF'], linha: '#306998' },
        retro:  { pontos: ['#245880', '#8a6400', '#6b6d68'], linha: '#245880' }
    };

    const config = {
        count: Math.min(Math.floor(window.innerWidth / 10), 100),
        maxDist: 130,
        speed: 0.4,
        size: { min: 1, max: 2.5 },
        colors: paletas.escuro.pontos,
        linha: paletas.escuro.linha,
        opacity: 0.7
    };

    window.__atualizarCoresParticulas = function () {
        const atual = document.documentElement.getAttribute('data-tema') || 'escuro';
        const paleta = paletas[atual] || paletas.escuro;
        config.colors = paleta.pontos;
        config.linha = paleta.linha;
        particles.forEach(p => { p.color = config.colors[Math.floor(Math.random() * config.colors.length)]; });
    };
    window.__atualizarCoresParticulas();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * config.speed;
            this.vy = (Math.random() - 0.5) * config.speed;
            this.size = Math.random() * (config.size.max - config.size.min) + config.size.min;
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
            if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = config.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < config.count; i++) particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < config.maxDist) {
                    ctx.beginPath();
                    ctx.strokeStyle = config.linha;
                    ctx.lineWidth = 0.5;
                    ctx.globalAlpha = (1 - dist / config.maxDist) * 0.25;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) { p.update(); p.draw(); }
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    init();
    animate();
});